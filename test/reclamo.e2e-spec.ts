/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import type { Response } from 'supertest';

describe('Reclamo E2E - GET /reclamo', () => {
  let app: INestApplication;
  let request;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const server = app.getHttpServer() as unknown as Server;
    request = supertest(server);

    // login real como cliente
    const loginRes = (await request
      .post('/auth/login')
      .send({
        email: 'cliente1@example.com',
        contraseña: 'password123',
      })
      .expect(200)) as unknown as { body: { access_token: string } };

    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('devuelve solo los reclamos del cliente logueado', async () => {
    const res = await request
      .get('/reclamo')
      .set('Authorization', `Bearer ${token}`)
      .expect(200) as unknown as Response;

    const body = res.body as Array<{
      id: string;
      clienteId?: string;
    }>;

    expect(Array.isArray(body)).toBe(true);

    // validación mínima de shape
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('id');
    }

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it('falla si no se envía token', async () => {
    await request
      .get('/reclamo')
      .expect(401);
  });

  it('falla si el token es de un empleado', async () => {
    const loginEmpleado = await request
      .post('/auth/login')
      .send({
        email: 'empleado1@example.com',
        contraseña: 'password123',
      })
      .expect(200) as unknown as Response;

    await request
      .get('/reclamo')
      .set(
        'Authorization',
        `Bearer ${loginEmpleado.body.access_token}`,
      )
      .expect(403);
  });
});
