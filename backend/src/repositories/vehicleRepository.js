const path = require('path');
const {
  readJsonFile,
  writeJsonFile,
  findById,
  createRecord,
  updateRecord,
  deleteRecord
} = require('./jsonRepository');

const vehiclesFilePath = path.join(__dirname, '../data/vehicles.json');

/**
 * Reads all vehicles from JSON file.
 */
async function getAllVehicles() {
  return await readJsonFile(vehiclesFilePath);
}

/**
 * Finds a vehicle by ID.
 */
async function findVehicleById(id) {
  return await findById(vehiclesFilePath, id);
}

/**
 * Creates a new vehicle record.
 */
async function createVehicle(vehicleData) {
  return await createRecord(vehiclesFilePath, vehicleData);
}

/**
 * Updates an existing vehicle record by ID.
 */
async function updateVehicle(id, updates) {
  return await updateRecord(vehiclesFilePath, id, updates);
}

/**
 * Deletes a vehicle record by ID.
 */
async function deleteVehicle(id) {
  return await deleteRecord(vehiclesFilePath, id);
}

module.exports = {
  getAllVehicles,
  findVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  vehiclesFilePath
};
