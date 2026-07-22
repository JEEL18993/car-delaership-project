const vehicleRepository = require('../repositories/vehicleRepository');

/**
 * Service to retrieve all vehicles.
 */
async function getAllVehicles() {
  return await vehicleRepository.getAllVehicles();
}

/**
 * Service to search and filter vehicles by make, model, category, price range, fuelType, transmission, location, and featured flag.
 */
async function searchVehicles(params = {}) {
  const {
    make, model, category, minPrice, maxPrice, fuelType, transmission, location, featured
  } = params;

  const vehicles = await vehicleRepository.getAllVehicles();

  return vehicles.filter((v) => {
    if (make && typeof make === 'string' && !v.make.toLowerCase().includes(make.toLowerCase().trim())) {
      return false;
    }
    if (model && typeof model === 'string' && !v.model.toLowerCase().includes(model.toLowerCase().trim())) {
      return false;
    }
    if (category && typeof category === 'string' && !v.category.toLowerCase().includes(category.toLowerCase().trim())) {
      return false;
    }
    if (fuelType && typeof fuelType === 'string' && v.fuelType && !v.fuelType.toLowerCase().includes(fuelType.toLowerCase().trim())) {
      return false;
    }
    if (transmission && typeof transmission === 'string' && v.transmission && !v.transmission.toLowerCase().includes(transmission.toLowerCase().trim())) {
      return false;
    }
    if (location && typeof location === 'string' && v.location && !v.location.toLowerCase().includes(location.toLowerCase().trim())) {
      return false;
    }
    if (featured !== undefined && featured !== '') {
      const isFeaturedBool = String(featured).toLowerCase() === 'true';
      if (Boolean(v.featured) !== isFeaturedBool) {
        return false;
      }
    }
    if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice) && v.price < Number(minPrice)) {
      return false;
    }
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice) && v.price > Number(maxPrice)) {
      return false;
    }
    return true;
  });
}

/**
 * Service to create a new vehicle.
 */
async function createVehicle(vehicleData) {
  return await vehicleRepository.createVehicle(vehicleData);
}

/**
 * Service to update an existing vehicle by ID.
 */
async function updateVehicle(id, updates) {
  const existing = await vehicleRepository.findVehicleById(id);
  if (!existing) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
  return await vehicleRepository.updateVehicle(id, updates);
}

/**
 * Service to delete a vehicle by ID.
 */
async function deleteVehicle(id) {
  const existing = await vehicleRepository.findVehicleById(id);
  if (!existing) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
  return await vehicleRepository.deleteVehicle(id);
}

module.exports = {
  getAllVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
