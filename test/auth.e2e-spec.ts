/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import supertest, { Response } from 'supertest';
import { Server } from 'http';


describe('Auth E2E - POST /auth/login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('login exitoso con credenciales válidas', async () => {
    const server = app.getHttpServer() as unknown as Server;

    const res: Response = await supertest(server)
      .post('/auth/login')
      .send({
        email: 'empleado1@example.com',
        contraseña: 'password123',
      })
      .expect(200) as unknown as Response;

    const body = res.body as { access_token: string };

    expect(body.access_token).toBeDefined();
  });

  it('falla con contraseña incorrecta', async () => {
    const server = app.getHttpServer() as unknown as Server;
    await supertest(server)
      .post('/auth/login')
      .send({
        email: 'empleado1@example.com',
        contraseña: 'incorrecta',
      })
      .expect(401);
  });

  it('falla con email inexistente', async () => {
    const server = app.getHttpServer() as unknown as Server;
    await supertest(server)
      .post('/auth/login')
      .send({
        email: 'noexiste@gmail.com',
        contraseña: 'password123',
      })
      .expect(401);
  });
});
