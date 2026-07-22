const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Reads and parses a JSON file asynchronously.
 * Returns empty array if file does not exist.
 * Throws error if JSON content is invalid.
 */
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in file: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Formats and writes data to a JSON file asynchronously.
 * Automatically creates directory paths if needed.
 */
async function writeJsonFile(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Finds a single record by id from a JSON file.
 */
async function findById(filePath, id) {
  const records = await readJsonFile(filePath);
  return records.find((item) => String(item.id) === String(id)) || null;
}

/**
 * Creates and appends a new record to a JSON file.
 * Generates a unique UUID id if none is provided.
 */
async function createRecord(filePath, record) {
  const records = await readJsonFile(filePath);
  const newRecord = {
    id: record.id || uuidv4(),
    ...record
  };
  records.push(newRecord);
  await writeJsonFile(filePath, records);
  return newRecord;
}

/**
 * Updates an existing record by id in a JSON file.
 * Returns the updated record or null if not found.
 */
async function updateRecord(filePath, id, updates) {
  const records = await readJsonFile(filePath);
  const index = records.findIndex((item) => String(item.id) === String(id));
  
  if (index === -1) {
    return null;
  }

  records[index] = {
    ...records[index],
    ...updates,
    id: records[index].id // Ensure ID is preserved
  };

  await writeJsonFile(filePath, records);
  return records[index];
}

/**
 * Deletes a record by id from a JSON file.
 * Returns true if deleted, or false if not found.
 */
async function deleteRecord(filePath, id) {
  const records = await readJsonFile(filePath);
  const initialLength = records.length;
  const filteredRecords = records.filter((item) => String(item.id) !== String(id));

  if (filteredRecords.length === initialLength) {
    return false;
  }

  await writeJsonFile(filePath, filteredRecords);
  return true;
}

module.exports = {
  readJsonFile,
  writeJsonFile,
  findById,
  createRecord,
  updateRecord,
  deleteRecord
};
