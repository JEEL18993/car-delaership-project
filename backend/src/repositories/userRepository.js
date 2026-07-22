const path = require('path');
const {
  readJsonFile,
  writeJsonFile,
  findById,
  createRecord,
  updateRecord,
  deleteRecord
} = require('./jsonRepository');

const usersFilePath = path.join(__dirname, '../data/users.json');

/**
 * Finds a user by email address (case-insensitive).
 */
async function findByEmail(email) {
  if (!email) return null;
  const users = await readJsonFile(usersFilePath);
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Finds a user by ID.
 */
async function findUserById(id) {
  return await findById(usersFilePath, id);
}

/**
 * Creates a new user record.
 */
async function createUser(userData) {
  return await createRecord(usersFilePath, userData);
}

/**
 * Returns all user records.
 */
async function getAllUsers() {
  return await readJsonFile(usersFilePath);
}

module.exports = {
  findByEmail,
  findUserById,
  createUser,
  getAllUsers,
  usersFilePath
};
