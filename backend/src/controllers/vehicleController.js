const vehicleService = require('../services/vehicleService');
const inventoryService = require('../services/inventoryService');
const { validateCreateVehicleInput, validateUpdateVehicleInput } = require('../validations/vehicleValidation');

/**
 * GET /api/vehicles
 */
async function getVehicles(req, res, next) {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/vehicles/search
 */
async function searchVehicles(req, res, next) {
  try {
    const vehicles = await vehicleService.searchVehicles(req.query);
    return res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/vehicles
 */
async function createVehicle(req, res, next) {
  try {
    const validationError = validateCreateVehicleInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const newVehicle = await vehicleService.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: newVehicle
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/vehicles/:id
 */
async function updateVehicle(req, res, next) {
  try {
    const validationError = validateUpdateVehicleInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updated = await vehicleService.updateVehicle(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/vehicles/:id
 */
async function deleteVehicle(req, res, next) {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/vehicles/:id/purchase
 */
async function purchaseVehicle(req, res, next) {
  try {
    const updatedVehicle = await inventoryService.purchaseVehicle(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Vehicle purchased successfully',
      data: updatedVehicle
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/vehicles/:id/restock
 */
async function restockVehicle(req, res, next) {
  try {
    const amount = req.body ? req.body.amount : undefined;
    const updatedVehicle = await inventoryService.restockVehicle(req.params.id, amount);
    return res.status(200).json({
      success: true,
      message: 'Vehicle restocked successfully',
      data: updatedVehicle
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
};
