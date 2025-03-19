import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('EntriesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/entries (POST)', () => {
    return request(app.getHttpServer())
      .post('/entries')
      .send({ title: 'Test Entry', amount: 100 })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Entry');
        expect(res.body.amount).toBe(100);
      });
  });

  it('/entries (GET)', () => {
    return request(app.getHttpServer())
      .get('/entries')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/entries/category/:categoryId (GET)', () => {
    return request(app.getHttpServer())
      .get('/entries/category/2')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/entries/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/entries/3')
      .send({ title: 'Updated Entry', amount: 150 })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Updated Entry');
        expect(res.body.amount).toBe(150);
      });
  });

  it('/entries/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/entries/2').expect(204);
  });
});
