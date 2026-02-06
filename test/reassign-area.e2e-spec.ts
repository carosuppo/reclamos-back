import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Estados } from '@prisma/client';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { Medidas } from 'src/common/enums/medidas.enum';
import { Role } from 'src/common/enums/role.enum';
import prisma from 'src/lib/db';
import supertest, { Response } from 'supertest';
import {
  createArea,
  createCliente,
  createEmpleado,
  createProyecto,
  createTipoProyecto,
  createTipoReclamo,
} from './utils/factory';
import { signEmpleadoToken } from './utils/jwt';

describe('Reclamo – Reassign Area (E2E)', () => {
  let app: INestApplication;
  let server: Server;
  let token: string;

  let areaOrigenId: string;
  let areaDestinoId: string;
  let empleadoId: string;
  let reclamoId: string;
  let clienteId: string;
  let tipoReclamoId: string;
  let tipoProyectoId: string;
  let proyectoId: string;

  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;

    const areaOrigen = await createArea();
    const areaDestino = await createArea();

    areaOrigenId = areaOrigen.id;
    areaDestinoId = areaDestino.id;

    const { empleado } = await createEmpleado(password, areaOrigenId);

    empleadoId = empleado.id;

    token = signEmpleadoToken({
      id: empleadoId,
      role: Role.EMPLEADO,
    });

    const { cliente } = await createCliente(password);
    const tipoReclamo = await createTipoReclamo();
    const tipoProyecto = await createTipoProyecto();

    clienteId = cliente.id;
    tipoReclamoId = tipoReclamo.id;
    tipoProyectoId = tipoProyecto.id;

    const proyecto = await createProyecto(clienteId, tipoProyectoId);

    proyectoId = proyecto.id;

    const reclamo = await prisma.reclamo.create({
      data: {
        tipoReclamoId: tipoReclamoId,
        proyectoId: proyectoId,
        estado: Estados.PENDIENTE,
        prioridad: Medidas.MEDIA,
        criticidad: Medidas.MEDIA,
        descripcion: 'Reclamo test',
      },
    });

    reclamoId = reclamo.id;

    await prisma.cambioEstado.create({
      data: {
        reclamoId,
        areaId: areaOrigenId,
        estado: Estados.PENDIENTE,
        descripcion: 'Inicial',
      },
    });
  });

  afterAll(async () => {
    await prisma.cambioEstado.deleteMany({
      where: { reclamoId },
    });
    await prisma.reclamo.deleteMany({
      where: { id: reclamoId },
    });
    await prisma.proyecto.deleteMany({
      where: { id: proyectoId },
    });
    await prisma.empleado.deleteMany({
      where: { id: empleadoId },
    });
    await prisma.cliente.deleteMany({
      where: { id: clienteId },
    });
    await prisma.tipoReclamo.deleteMany({
      where: { id: tipoReclamoId },
    });
    await prisma.tipoProyecto.deleteMany({
      where: { id: tipoProyectoId },
    });
    await prisma.area.deleteMany({
      where: { id: { in: [areaOrigenId, areaDestinoId] } },
    });
    await prisma.$disconnect();
    await app.close();
  });

  it('reasigna el área y vuelve el reclamo a PENDIENTE', async () => {
    await supertest(server)
      .put(`/reclamo/reassign-area/${reclamoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        areaId: areaDestinoId,
        descripcion: 'Derivado a infraestructura',
      })
      .expect(HttpStatus.OK);

    const reclamo = await prisma.reclamo.findUnique({
      where: { id: reclamoId },
    });

    expect(reclamo?.estado).toBe(Estados.PENDIENTE);

    const cambios = await prisma.cambioEstado.findMany({
      where: { reclamoId },
      orderBy: { fechaInicio: 'desc' },
    });

    expect(cambios[0].areaId).toBe(areaDestinoId);
    expect(cambios[0].estado).toBe(Estados.PENDIENTE);
    expect(cambios[0].descripcion).toBe('Derivado a infraestructura');
  });

  it('el empleado ya no ve el reclamo en su área', async () => {
    const response = (await supertest(server)
      .get('/reclamo/area')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)) as unknown as Response;

    expect(response.body).toEqual([]);
  });
});
