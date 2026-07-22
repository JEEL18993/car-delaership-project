/**
 * Validates vehicle creation input.
 */
function validateCreateVehicleInput({ make, model, category, price, quantity } = {}) {
  if (!make || typeof make !== 'string' || !make.trim()) {
    return 'Make is required';
  }
  if (!model || typeof model !== 'string' || !model.trim()) {
    return 'Model is required';
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    return 'Category is required';
  }
  if (price === undefined || price === null || typeof price !== 'number' || price <= 0) {
    return 'Price must be a number greater than zero';
  }
  if (quantity === undefined || quantity === null || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
    return 'Quantity must be a non-negative integer';
  }
  return null;
}

/**
 * Validates vehicle update input.
 */
function validateUpdateVehicleInput({ make, model, category, price, quantity } = {}) {
  if (make !== undefined && (typeof make !== 'string' || !make.trim())) {
    return 'Make cannot be empty';
  }
  if (model !== undefined && (typeof model !== 'string' || !model.trim())) {
    return 'Model cannot be empty';
  }
  if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
    return 'Category cannot be empty';
  }
  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return 'Price must be a number greater than zero';
  }
  if (quantity !== undefined && (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0)) {
    return 'Quantity must be a non-negative integer';
  }
  return null;
}

module.exports = {
  validateCreateVehicleInput,
  validateUpdateVehicleInput
};
