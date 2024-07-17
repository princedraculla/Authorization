import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role as userRoles } from '../src/enums/role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products/add (POST)', () => {
    it('should create a new product', () => {
      return request(app.getHttpServer())
        .post('/products/add')
        .send({ name: 'Product 1', price: 10, roles: userRoles.Admin })
        .expect(HttpStatus.CREATED);
    });

    it('should return 403 Forbidden for unauthorized user', () => {
      return request(app.getHttpServer())
        .post('/products/add')
        .send({ name: 'Product 1', price: 10, roles: userRoles.User })
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('/products/all (GET)', () => {
    it('should return an array of products', () => {
      return request(app.getHttpServer())
        .get('/products/all')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
        });
    });
  });

  describe('/products/one (GET)', () => {
    it('should return a product by ID', () => {
      const productId = 1; // Replace with an existing product ID

      return request(app.getHttpServer())
        .get('/products/one')
        .send({ id: productId })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.id).toBe(productId);
        });
    });
  });
});
