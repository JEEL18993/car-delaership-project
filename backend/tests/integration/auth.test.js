const request = require('supertest');
const app = require('../../src/app');
const path = require('path');
const bcrypt = require('bcryptjs');
const { readJsonFile, writeJsonFile } = require('../../src/repositories/jsonRepository');

const usersFilePath = path.join(__dirname, '../../src/data/users.json');

describe('Authentication API Endpoints (Integration)', () => {
  beforeEach(async () => {
    // Reset users.json before each test
    await writeJsonFile(usersFilePath, []);
  });

  afterAll(async () => {
    // Clean up after all tests and restore default accounts
    const adminHash = await bcrypt.hash('AdminPassword123!', 10);
    const userHash = await bcrypt.hash('Password123!', 10);
    const defaultAccounts = [
      {
        id: 'admin-id-1',
        name: 'System Admin',
        email: 'admin@example.com',
        password: adminHash,
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-id-1',
        name: 'Jeel Gohel',
        email: 'omgohel51@gmail.com',
        password: userHash,
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ];
    await writeJsonFile(usersFilePath, defaultAccounts);
  });

  describe('POST /api/auth/register', () => {
    test('should successfully register a new user with hashed password and default role "user"', async () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john@example.com');
      expect(res.body.data.role).toBe('user');
      expect(res.body.data.password).toBeUndefined();

      // Verify password was hashed in users.json
      const users = await readJsonFile(usersFilePath);
      expect(users).toHaveLength(1);
      expect(users[0].password).not.toBe('password123');
      const isMatch = await bcrypt.compare('password123', users[0].password);
      expect(isMatch).toBe(true);
    });

    test('should reject registration when name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'noname@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/name is required/i);
    });

    test('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Jane Doe', email: 'invalid-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email/i);
    });

    test('should reject registration with password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Jane Doe', email: 'jane@example.com', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/password must be at least 6 characters/i);
    });

    test('should reject registration with duplicate email', async () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await request(app).post('/api/auth/register').send(payload);

      const res = await request(app).post('/api/auth/register').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/email already registered/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user to test login
      await request(app).post('/api/auth/register').send({
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'securepassword'
      });
    });

    test('should successfully log in with correct credentials and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com', password: 'securepassword' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe('string');
      expect(res.body.data.email).toBe('alice@example.com');
      expect(res.body.data.password).toBeUndefined();
    });

    test('should reject login with unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unknown@example.com', password: 'securepassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    test('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    test('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/email and password are required/i);
    });
  });
});
