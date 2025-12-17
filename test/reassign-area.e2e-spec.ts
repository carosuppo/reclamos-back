import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import supertest, { Response } from 'supertest';
import { AppModule } from 'src/app.module';
import prisma from 'src/lib/db';
import { Estados } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { signEmpleadoToken } from './utils/jwt';
import { Medidas } from 'src/common/enums/medidas.enum';
import { Server } from 'http';

describe('Reclamo – Reassign Area (E2E)', () => {
  let app: INestApplication;
  let server: Server;
  let token: string;

  let areaOrigenId: string;
  let areaDestinoId: string;
  let empleadoId: string;
  let reclamoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;

    // Limpiar DB
    /*
    await prisma.cambioEstado.deleteMany();
    await prisma.reclamo.deleteMany();
    await prisma.empleado.deleteMany();
    await prisma.area.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.proyecto.deleteMany();
    await prisma.tipoReclamo.deleteMany();
    */

    // Áreas
    const areaOrigen = await prisma.area.create({
      data: { nombre: 'Soporte' },
    });

    const areaDestino = await prisma.area.create({
      data: { nombre: 'Infraestructura' },
    });

    areaOrigenId = areaOrigen.id;
    areaDestinoId = areaDestino.id;

    // Empleado
    const empleado = await prisma.empleado.create({
      data: {
        nombre: 'Empleado Test',
        email: 'empleado7@example.com',
        contraseña: 'password123',
        role: Role.EMPLEADO,
        areaId: areaOrigenId,
        telefono: '123',
      },
    });

    empleadoId = empleado.id;

    token = signEmpleadoToken({
      id: empleadoId,
      role: Role.EMPLEADO,
    });

    // Cliente + proyecto + tipo reclamo
    const cliente = await prisma.cliente.create({
      data: {
        nombre: 'Cliente',
        email: 'cliente5@example.com',
        contraseña: 'password123',
        telefono: '123',
        role: Role.CLIENTE,
      },
    });

    const tipoReclamo = await prisma.tipoReclamo.create({
      data: { nombre: 'Bug' },
    });

    const proyecto = await prisma.proyecto.create({
      data: {
        nombre: 'Proyecto',
        clienteId: cliente.id,
        tipoProyectoId: tipoReclamo.id,
      },
    });

    // Reclamo
    const reclamo = await prisma.reclamo.create({
      data: {
        tipoReclamoId: tipoReclamo.id,
        proyectoId: proyecto.id,
        estado: Estados.PENDIENTE,
        prioridad: Medidas.MEDIA,
        criticidad: Medidas.MEDIA,
        descripcion: 'Reclamo test',
      },
    });

    reclamoId = reclamo.id;

    // Cambio de estado inicial
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

    // Reclamo actualizado
    const reclamo = await prisma.reclamo.findUnique({
      where: { id: reclamoId },
    });

    expect(reclamo?.estado).toBe(Estados.PENDIENTE);

    // Último cambio de estado
    const cambios = await prisma.cambioEstado.findMany({
      where: { reclamoId },
      orderBy: { fechaInicio: 'desc' },
    });

    expect(cambios[0].areaId).toBe(areaDestinoId);
    expect(cambios[0].estado).toBe(Estados.PENDIENTE);
    expect(cambios[0].descripcion).toBe('Derivado a infraestructura');
  });

  it('el empleado ya no ve el reclamo en su área', async () => {
    const response = await supertest(server)
      .get('/reclamo/empleado')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual([]);
  });
});
