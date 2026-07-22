const vehicleRepository = require('../repositories/vehicleRepository');

/**
 * Service handling vehicle purchase operations.
 * Decreases quantity by 1 if stock is available.
 */
async function purchaseVehicle(id) {
  const vehicle = await vehicleRepository.findVehicleById(id);

  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (vehicle.quantity <= 0) {
    const error = new Error('Vehicle is out of stock');
    error.statusCode = 400;
    throw error;
  }

  const updatedQuantity = vehicle.quantity - 1;
  const updatedVehicle = await vehicleRepository.updateVehicle(id, { quantity: updatedQuantity });
  return updatedVehicle;
}

/**
 * Service handling vehicle restock operations.
 * Increases quantity by a positive integer amount.
 */
async function restockVehicle(id, amount) {
  if (
    amount === undefined ||
    amount === null ||
    typeof amount !== 'number' ||
    !Number.isInteger(amount) ||
    amount <= 0
  ) {
    const error = new Error('Restock amount must be a positive integer');
    error.statusCode = 400;
    throw error;
  }

  const vehicle = await vehicleRepository.findVehicleById(id);

  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedQuantity = vehicle.quantity + amount;
  const updatedVehicle = await vehicleRepository.updateVehicle(id, { quantity: updatedQuantity });
  return updatedVehicle;
}

module.exports = {
  purchaseVehicle,
  restockVehicle
};
