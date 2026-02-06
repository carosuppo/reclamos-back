import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Estados } from '@prisma/client';
import { Server } from 'http';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { Medidas } from '../src/common/enums/medidas.enum';
import prisma from '../src/lib/db';
import {
  createArea,
  createCliente,
  createEmpleado,
  createProyecto,
  createTipoProyecto,
  createTipoReclamo,
} from './utils/factory';

describe('Reclamo E2E - acciones principales', () => {
  let app: INestApplication;
  let request;

  const password = 'password123';
  let clienteEmail: string;
  let empleadoEmail: string;
  let clienteId: string;
  let empleadoId: string;
  let areaId: string;
  let tipoReclamoId: string;
  let tipoProyectoId: string;
  let proyectoId: string;
  let reclamoId: string;

  let clienteToken: string;
  let empleadoToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const server = app.getHttpServer() as unknown as Server;
    request = supertest(server);

    const area = await createArea();
    const tipoReclamo = await createTipoReclamo();
    const tipoProyecto = await createTipoProyecto();
    const { cliente, email: clienteMail } = await createCliente(password);
    const { empleado, email: empleadoMail } = await createEmpleado(
      password,
      area.id,
    );

    areaId = area.id;
    tipoReclamoId = tipoReclamo.id;
    tipoProyectoId = tipoProyecto.id;
    clienteId = cliente.id;
    empleadoId = empleado.id;
    clienteEmail = clienteMail;
    empleadoEmail = empleadoMail;

    const proyecto = await createProyecto(clienteId, tipoProyectoId);
    proyectoId = proyecto.id;

    const loginCliente = (await request
      .post('/auth/login')
      .send({
        email: clienteEmail,
        contraseña: password,
      })
      .expect(HttpStatus.OK)) as unknown as { body: { access_token: string } };

    clienteToken = loginCliente.body.access_token;

    const loginEmpleado = (await request
      .post('/auth/login')
      .send({
        email: empleadoEmail,
        contraseña: password,
      })
      .expect(HttpStatus.OK)) as unknown as { body: { access_token: string } };

    empleadoToken = loginEmpleado.body.access_token;
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
      where: { id: areaId },
    });
    await prisma.$disconnect();
    await app.close();
  });

  it('crea un reclamo y devuelve estado pendiente', async () => {
    const response = await request
      .post('/reclamo')
      .set('Authorization', `Bearer ${clienteToken}`)
      .send({
        tipoReclamoId,
        proyectoId,
        prioridad: Medidas.MEDIA,
        criticidad: Medidas.BAJA,
        areaId,
        descripcion: 'Nuevo reclamo',
      })
      .expect(HttpStatus.CREATED);

    reclamoId = response.body.id;

    expect(response.body.estado).toBe(Estados.PENDIENTE);
  });

  it('actualiza la descripción del reclamo', async () => {
    const response = await request
      .patch(`/reclamo/${reclamoId}`)
      .set('Authorization', `Bearer ${clienteToken}`)
      .send({
        descripcion: 'Descripción actualizada',
        prioridad: Medidas.ALTA,
      })
      .expect(HttpStatus.OK);

    expect(response.body.descripcion).toBe('Descripción actualizada');
    expect(response.body.estado).toBe(Estados.PENDIENTE);
  });

  it('cambia el estado del reclamo a EN_PROCESO', async () => {
    const response = await request
      .put(`/reclamo/change-estado/${reclamoId}`)
      .set('Authorization', `Bearer ${empleadoToken}`)
      .send({
        estado: Estados.EN_PROCESO,
        descripcion: 'En revisión',
      })
      .expect(HttpStatus.OK);

    expect(response.body.estado).toBe(Estados.EN_PROCESO);
  });

  it('el empleado ve reclamos asignados a su área', async () => {
    const response = await request
      .get('/reclamo/area')
      .set('Authorization', `Bearer ${empleadoToken}`)
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
    expect(
      response.body.some((item: { id: string }) => item.id === reclamoId),
    ).toBe(true);
  });
});
