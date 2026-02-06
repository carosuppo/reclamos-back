/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import supertest, { Response } from 'supertest';
import { Server } from 'http';
import prisma from '../src/lib/db';
import {
  createCliente,
  createEmpleado,
} from './utils/factory';


describe('Auth E2E - POST /auth/login', () => {
  let app: INestApplication;
  let server: Server;

  const password = 'password123';
  let clienteEmail: string;
  let empleadoEmail: string;
  let clienteId: string;
  let empleadoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as unknown as Server;

    const { cliente, email: clienteMail } = await createCliente(password);
    const { empleado, email: empleadoMail } = await createEmpleado(password);

    clienteEmail = clienteMail;
    empleadoEmail = empleadoMail;
    clienteId = cliente.id;
    empleadoId = empleado.id;
  });

  afterAll(async () => {
    await prisma.empleado.deleteMany({
      where: { id: empleadoId },
    });
    await prisma.cliente.deleteMany({
      where: { id: clienteId },
    });
    await prisma.$disconnect();
    await app.close();
  });

  it('login exitoso con credenciales válidas (cliente)', async () => {
    const res: Response = await supertest(server)
      .post('/auth/login')
      .send({
        email: clienteEmail,
        contraseña: password,
      })
      .expect(200) as unknown as Response;

    const body = res.body as { access_token: string };

    expect(body.access_token).toBeDefined();
  });

  it('login exitoso con credenciales válidas (empleado)', async () => {
    const res: Response = await supertest(server)
      .post('/auth/login')
      .send({
        email: empleadoEmail,
        contraseña: password,
      })
      .expect(200) as unknown as Response;

    const body = res.body as { access_token: string };

    expect(body.access_token).toBeDefined();
  });

  it('falla con contraseña incorrecta', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({
        email: clienteEmail,
        contraseña: 'incorrecta',
      })
      .expect(401);
  });

  it('falla con email inexistente', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({
        email: 'noexiste@gmail.com',
        contraseña: password,
      })
      .expect(401);
  });
});
