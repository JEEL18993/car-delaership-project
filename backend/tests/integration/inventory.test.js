const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const path = require('path');
const { writeJsonFile, readJsonFile } = require('../../src/repositories/jsonRepository');

const vehiclesFilePath = path.join(__dirname, '../../src/data/vehicles.json');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_dealership_2026';

describe('Inventory API Endpoints - Purchase & Restock (Integration)', () => {
  let userToken;
  let adminToken;

  const sampleVehicles = [
    {
      id: 'v1',
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 2
    },
    {
      id: 'v2',
      make: 'Tesla',
      model: 'Model 3',
      category: 'Electric',
      price: 35000,
      quantity: 0
    }
  ];

  beforeAll(() => {
    userToken = jwt.sign({ id: 'u1', email: 'user@example.com', role: 'user' }, JWT_SECRET);
    adminToken = jwt.sign({ id: 'a1', email: 'admin@example.com', role: 'admin' }, JWT_SECRET);
  });

  beforeEach(async () => {
    await writeJsonFile(vehiclesFilePath, sampleVehicles);
  });

  afterAll(async () => {
    await writeJsonFile(vehiclesFilePath, sampleVehicles);
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    test('should allow an authenticated user to purchase a vehicle and decrease quantity by 1', async () => {
      const res = await request(app)
        .post('/api/vehicles/v1/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(1);

      const all = await readJsonFile(vehiclesFilePath);
      expect(all.find((v) => v.id === 'v1').quantity).toBe(1);
    });

    test('should allow an admin user to purchase a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles/v1/purchase')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(1);
    });

    test('should return HTTP 400 when vehicle quantity is zero (out of stock)', async () => {
      const res = await request(app)
        .post('/api/vehicles/v2/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/out of stock/i);
    });

    test('should return HTTP 404 for an unknown vehicle ID', async () => {
      const res = await request(app)
        .post('/api/vehicles/unknown-id/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/vehicle not found/i);
    });

    test('should reject unauthenticated users with 401 Unauthorized', async () => {
      const res = await request(app).post('/api/vehicles/v1/purchase');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    test('should allow admin to increase vehicle quantity with positive integer amount', async () => {
      const res = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(7); // 2 + 5

      const all = await readJsonFile(vehiclesFilePath);
      expect(all.find((v) => v.id === 'v1').quantity).toBe(7);
    });

    test('should reject non-admin users with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 5 });

      expect(res.status).toBe(403);
    });

    test('should reject zero, negative, decimal or missing restock amount with 400 Bad Request', async () => {
      // Test missing
      const res1 = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res1.status).toBe(400);

      // Test zero
      const res2 = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 0 });
      expect(res2.status).toBe(400);

      // Test negative
      const res3 = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: -3 });
      expect(res3.status).toBe(400);

      // Test decimal
      const res4 = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 2.5 });
      expect(res4.status).toBe(400);
    });

    test('should return HTTP 404 for an unknown vehicle ID', async () => {
      const res = await request(app)
        .post('/api/vehicles/unknown-id/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 5 });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/vehicle not found/i);
    });
  });
});
