const fs = require('fs').promises;
const path = require('path');
const {
  readJsonFile,
  writeJsonFile,
  findById,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../../src/repositories/jsonRepository');

describe('JSON Repository Functions', () => {
  const testDirPath = path.join(__dirname, 'temp_test_data');
  const validFilePath = path.join(testDirPath, 'test_items.json');
  const invalidFilePath = path.join(testDirPath, 'corrupt.json');
  const missingFilePath = path.join(testDirPath, 'non_existent.json');

  beforeEach(async () => {
    await fs.mkdir(testDirPath, { recursive: true });
    const initialData = [
      { id: '1', name: 'Item One', category: 'A' },
      { id: '2', name: 'Item Two', category: 'B' }
    ];
    await fs.writeFile(validFilePath, JSON.stringify(initialData, null, 2), 'utf8');
    await fs.writeFile(invalidFilePath, '{ invalid json content }', 'utf8');
  });

  afterEach(async () => {
    try {
      await fs.rm(testDirPath, { recursive: true, force: true });
    } catch (err) {
      // ignore clean up errors
    }
  });

  describe('readJsonFile', () => {
    test('should read and parse valid JSON file content', async () => {
      const data = await readJsonFile(validFilePath);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Item One');
    });

    test('should return empty array if file does not exist', async () => {
      const data = await readJsonFile(missingFilePath);
      expect(data).toEqual([]);
    });

    test('should throw a descriptive error when parsing invalid JSON', async () => {
      await expect(readJsonFile(invalidFilePath)).rejects.toThrow(/Invalid JSON format/i);
    });

    test('should rethrow unknown file read errors', async () => {
      jest.spyOn(fs, 'readFile').mockRejectedValueOnce(new Error('Permission denied'));
      await expect(readJsonFile(validFilePath)).rejects.toThrow('Permission denied');
      jest.restoreAllMocks();
    });
  });


  describe('writeJsonFile', () => {
    test('should format and write JSON data to file', async () => {
      const newData = [{ id: '100', name: 'New Item' }];
      await writeJsonFile(validFilePath, newData);

      const content = await fs.readFile(validFilePath, 'utf8');
      expect(content).toContain('\n    "id": "100"'); // verify pretty printing with 2-space indentation
      expect(JSON.parse(content)).toEqual(newData);
    });
  });


  describe('findById', () => {
    test('should return matching record by id', async () => {
      const record = await findById(validFilePath, '2');
      expect(record).toEqual({ id: '2', name: 'Item Two', category: 'B' });
    });

    test('should return null if record id is not found', async () => {
      const record = await findById(validFilePath, '999');
      expect(record).toBeNull();
    });
  });

  describe('createRecord', () => {
    test('should append a new record to the JSON file', async () => {
      const newRecord = { name: 'Item Three', category: 'C' };
      const created = await createRecord(validFilePath, newRecord);

      expect(created.id).toBeDefined();
      expect(created.name).toBe('Item Three');

      const all = await readJsonFile(validFilePath);
      expect(all).toHaveLength(3);
    });
  });

  describe('updateRecord', () => {
    test('should update existing record matching id and return updated record', async () => {
      const updated = await updateRecord(validFilePath, '1', { name: 'Updated Item One' });
      expect(updated.name).toBe('Updated Item One');
      expect(updated.category).toBe('A');

      const record = await findById(validFilePath, '1');
      expect(record.name).toBe('Updated Item One');
    });

    test('should return null if record to update is not found', async () => {
      const result = await updateRecord(validFilePath, 'non-existent', { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteRecord', () => {
    test('should delete record matching id and return true', async () => {
      const result = await deleteRecord(validFilePath, '1');
      expect(result).toBe(true);

      const all = await readJsonFile(validFilePath);
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe('2');
    });

    test('should return false if record to delete is not found', async () => {
      const result = await deleteRecord(validFilePath, '999');
      expect(result).toBe(false);
    });
  });
});
