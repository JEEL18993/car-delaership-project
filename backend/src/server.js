require('dotenv').config();
const app = require('./app');
const userRepository = require('./repositories/userRepository');
const authService = require('./services/authService');

const PORT = process.env.PORT || 5000;

/**
 * Ensures default admin and user accounts exist on server startup.
 */
async function ensureDefaultAccounts() {
  try {
    const adminEmail = 'admin@example.com';
    const userEmail = 'omgohel51@gmail.com';

    const existingAdmin = await userRepository.findByEmail(adminEmail);
    if (!existingAdmin) {
      await authService.registerUser({
        name: 'System Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin'
      });
      console.log(`Auto-seeded default admin account (${adminEmail})`);
    }

    const existingUser = await userRepository.findByEmail(userEmail);
    if (!existingUser) {
      await authService.registerUser({
        name: 'Jeel Gohel',
        email: userEmail,
        password: 'Password123!',
        role: 'user'
      });
      console.log(`Auto-seeded default user account (${userEmail})`);
    }
  } catch (err) {
    console.error('Error auto-seeding default accounts:', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await ensureDefaultAccounts();
});
