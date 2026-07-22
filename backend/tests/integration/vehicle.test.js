const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const path = require('path');
const { writeJsonFile, readJsonFile } = require('../../src/repositories/jsonRepository');

const vehiclesFilePath = path.join(__dirname, '../../src/data/vehicles.json');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_dealership_2026';

describe('Vehicle API Endpoints (Integration)', () => {
  let userToken;
  let adminToken;

  const sampleVehicles = [
    {
      id: 'v1',
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5
    },
    {
      id: 'v2',
      make: 'Honda',
      model: 'CR-V',
      category: 'SUV',
      price: 32000,
      quantity: 3
    },
    {
      id: 'v3',
      make: 'Ford',
      model: 'F-150',
      category: 'Truck',
      price: 45000,
      quantity: 2
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

  describe('GET /api/vehicles', () => {
    test('should return all vehicles for an authenticated user', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    test('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles/search', () => {
    test('should search by make (case-insensitive)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=toyota')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].make).toBe('Toyota');
    });

    test('should search by model (case-insensitive)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?model=cr-v')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].model).toBe('CR-V');
    });

    test('should search by category (case-insensitive)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=suv')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].category).toBe('SUV');
    });

    test('should filter by minPrice and maxPrice', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=30000&maxPrice=50000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2); // Honda (32000) and Ford (45000)
    });

    test('should combine multiple filters', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=truck&minPrice=40000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].model).toBe('F-150');
    });

    test('should return an empty array when nothing matches', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Ferrari')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    test('should reject search for unauthenticated user', async () => {
      const res = await request(app).get('/api/vehicles/search?make=Toyota');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/vehicles', () => {
    const validVehicle = {
      make: 'Nissan',
      model: 'Altima',
      category: 'Sedan',
      price: 24000,
      quantity: 4
    };

    test('should allow admin to create a vehicle with generated UUID', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validVehicle);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.make).toBe('Nissan');

      const all = await readJsonFile(vehiclesFilePath);
      expect(all).toHaveLength(4);
    });

    test('should reject creation from normal user with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validVehicle);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    test('should reject creation with invalid fields', async () => {
      const invalidVehicle = {
        make: '',
        model: 'Altima',
        category: 'Sedan',
        price: -10,
        quantity: -1
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidVehicle);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    test('should allow admin to update a vehicle', async () => {
      const updates = { price: 27000, quantity: 10 };

      const res = await request(app)
        .put('/api/vehicles/v1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(27000);
      expect(res.body.data.quantity).toBe(10);
      expect(res.body.data.make).toBe('Toyota'); // original preserved
    });

    test('should reject normal user with HTTP 403', async () => {
      const res = await request(app)
        .put('/api/vehicles/v1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 27000 });

      expect(res.status).toBe(403);
    });

    test('should return 404 for unknown vehicle', async () => {
      const res = await request(app)
        .put('/api/vehicles/unknown-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 27000 });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/vehicle not found/i);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    test('should allow admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete('/api/vehicles/v1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const all = await readJsonFile(vehiclesFilePath);
      expect(all).toHaveLength(2);
    });

    test('should reject normal user with HTTP 403', async () => {
      const res = await request(app)
        .delete('/api/vehicles/v1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    test('should return 404 for unknown vehicle', async () => {
      const res = await request(app)
        .delete('/api/vehicles/unknown-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/vehicle not found/i);
    });
  });
});
