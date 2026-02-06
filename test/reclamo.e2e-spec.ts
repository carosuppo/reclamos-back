/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import type { Response } from 'supertest';
import prisma from '../src/lib/db';
import { Estados } from '@prisma/client';
import {
  createArea,
  createCliente,
  createEmpleado,
  createProyecto,
  createReclamo,
  createTipoProyecto,
  createTipoReclamo,
} from './utils/factory';


describe('Reclamo E2E - GET /reclamo', () => {
  let app: INestApplication;
  let request;
  let token: string;
  let empleadoToken: string;

  const password = 'password123';

  let clienteId: string;
  let clienteEmail: string;
  let clienteExtraId: string;
  let empleadoId: string;
  let reclamoClienteId: string;
  let reclamoOtroClienteId: string;
  let proyectoId: string;
  let proyectoExtraId: string;
  let tipoReclamoId: string;
  let tipoProyectoId: string;
  let areaId: string;

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
    const { cliente, email } = await createCliente(password);
    const { cliente: clienteExtra } = await createCliente(password);
    const { empleado } = await createEmpleado(password, area.id);

    areaId = area.id;
    tipoReclamoId = tipoReclamo.id;
    tipoProyectoId = tipoProyecto.id;
    clienteId = cliente.id;
    clienteExtraId = clienteExtra.id;
    empleadoId = empleado.id;
    clienteEmail = email;

    const proyecto = await createProyecto(clienteId, tipoProyectoId);
    const proyectoExtra = await createProyecto(clienteExtraId, tipoProyectoId);

    proyectoId = proyecto.id;
    proyectoExtraId = proyectoExtra.id;

    const reclamoCliente = await createReclamo({
      tipoReclamoId,
      proyectoId,
      descripcion: 'Reclamo cliente',
    });
    const reclamoOtro = await createReclamo({
      tipoReclamoId,
      proyectoId: proyectoExtraId,
      descripcion: 'Reclamo otro cliente',
    });

    reclamoClienteId = reclamoCliente.id;
    reclamoOtroClienteId = reclamoOtro.id;

    await prisma.cambioEstado.create({
      data: {
        reclamoId: reclamoClienteId,
        areaId,
        estado: Estados.PENDIENTE,
        clienteId,
        descripcion: 'Inicial',
      },
    });

    await prisma.cambioEstado.create({
      data: {
        reclamoId: reclamoOtroClienteId,
        areaId,
        estado: Estados.PENDIENTE,
        clienteId: clienteExtraId,
        descripcion: 'Inicial',
      },
    });

    const loginRes = (await request
      .post('/auth/login')
      .send({
        email: clienteEmail,
        contraseña: password,
      })
      .expect(200)) as unknown as { body: { access_token: string } };

    token = loginRes.body.access_token;

    const loginEmpleado = (await request
      .post('/auth/login')
      .send({
        email: empleado.email,
        contraseña: password,
      })
      .expect(200)) as unknown as { body: { access_token: string } };

    empleadoToken = loginEmpleado.body.access_token;
  });

  afterAll(async () => {
    await prisma.cambioEstado.deleteMany({
      where: { reclamoId: { in: [reclamoClienteId, reclamoOtroClienteId] } },
    });
    await prisma.reclamo.deleteMany({
      where: { id: { in: [reclamoClienteId, reclamoOtroClienteId] } },
    });
    await prisma.proyecto.deleteMany({
      where: { id: { in: [proyectoId, proyectoExtraId] } },
    });
    await prisma.empleado.deleteMany({
      where: { id: empleadoId },
    });
    await prisma.cliente.deleteMany({
      where: { id: { in: [clienteId, clienteExtraId] } },
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

  it('devuelve solo los reclamos del cliente logueado', async () => {
    const res = await request
      .get('/reclamo')
      .set('Authorization', `Bearer ${token}`)
      .expect(200) as unknown as Response;

    const body = res.body as Array<{
      id: string;
    }>;

    expect(Array.isArray(body)).toBe(true);
    expect(body.some((item) => item.id === reclamoClienteId)).toBe(true);
    expect(body.some((item) => item.id === reclamoOtroClienteId)).toBe(false);
  });

  it('falla si no se envía token', async () => {
    await request
      .get('/reclamo')
      .expect(401);
  });

  it('falla si el token es de un empleado', async () => {
    await request
      .get('/reclamo')
      .set('Authorization', `Bearer ${empleadoToken}`)
      .expect(403);
  });
});
