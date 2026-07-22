const path = require('path');
const seedAdmin = require('../../scripts/seedAdmin');
const userRepository = require('../../src/repositories/userRepository');
const { writeJsonFile } = require('../../src/repositories/jsonRepository');

describe('Admin Seeding Script (Unit Tests)', () => {
  beforeEach(async () => {
    // Clear users before each test
    await writeJsonFile(userRepository.usersFilePath, []);
    process.env.ADMIN_NAME = 'Test Admin';
    process.env.ADMIN_EMAIL = 'admin_test@dealership.com';
    process.env.ADMIN_PASSWORD = 'TestPassword123!';
  });

  afterEach(async () => {
    await writeJsonFile(userRepository.usersFilePath, []);
  });

  test('should create a new admin user if email does not exist', async () => {
    const admin = await seedAdmin();

    expect(admin).toBeDefined();
    expect(admin.email).toBe('admin_test@dealership.com');
    expect(admin.role).toBe('admin');
    expect(admin.password).toBeUndefined();

    const storedUser = await userRepository.findByEmail('admin_test@dealership.com');
    expect(storedUser).toBeDefined();
    expect(storedUser.role).toBe('admin');
  });

  test('should return existing admin user without duplicating if email already exists', async () => {
    await seedAdmin();
    const allUsersBefore = await userRepository.getAllUsers();
    expect(allUsersBefore).toHaveLength(1);

    const secondRun = await seedAdmin();
    const allUsersAfter = await userRepository.getAllUsers();
    expect(allUsersAfter).toHaveLength(1);
    expect(secondRun.email).toBe('admin_test@dealership.com');
  });
});
