require('dotenv').config();
const path = require('path');
const authService = require('../src/services/authService');
const userRepository = require('../src/repositories/userRepository');

/**
 * Script to seed an admin user into the JSON storage safely.
 * Never logs passwords or sensitive credentials.
 */
async function seedAdmin() {
  const name = process.env.ADMIN_NAME || 'System Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@dealership.com';
  const password = process.env.ADMIN_PASSWORD || 'AdminSecret123!';

  try {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      console.log(`Admin user with email "${email}" already exists.`);
      return existingUser;
    }

    const adminUser = await authService.registerUser({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log(`Admin user "${adminUser.name}" (${adminUser.email}) created successfully with role "${adminUser.role}".`);
    return adminUser;
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  seedAdmin().then(() => process.exit(0));
}

module.exports = seedAdmin;
