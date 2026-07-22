/**
 * Validates vehicle creation input payload.
 * Returns error string if invalid, or null if valid.
 */
function validateCreateVehicleInput(data = {}) {
  const {
    make, model, category, price, quantity, year, condition, features, images
  } = data;

  if (!make || typeof make !== 'string' || !make.trim()) {
    return 'Make is required and must be a non-empty string';
  }
  if (!model || typeof model !== 'string' || !model.trim()) {
    return 'Model is required and must be a non-empty string';
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    return 'Category is required and must be a non-empty string';
  }
  if (price === undefined || price === null || typeof price !== 'number' || isNaN(price) || price <= 0) {
    return 'Price must be a valid number greater than zero';
  }
  if (quantity === undefined || quantity === null || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
    return 'Quantity must be a non-negative integer';
  }

  const currentYear = new Date().getFullYear();
  if (year !== undefined && year !== null) {
    if (typeof year !== 'number' || year < 1990 || year > currentYear + 1) {
      return `Year must be between 1990 and ${currentYear + 1}`;
    }
  }

  if (condition !== undefined && condition !== null) {
    if (condition !== 'New' && condition !== 'Used') {
      return "Condition must be 'New' or 'Used'";
    }
  }

  if (features !== undefined && features !== null && !Array.isArray(features)) {
    return 'Features must be an array of strings';
  }

  if (images !== undefined && images !== null && !Array.isArray(images)) {
    return 'Images must be an array of image URL strings';
  }

  return null;
}

/**
 * Validates vehicle update input payload.
 * Returns error string if invalid, or null if valid.
 */
function validateUpdateVehicleInput(data = {}) {
  const {
    make, model, category, price, quantity, year, condition, features, images
  } = data;

  if (make !== undefined && (typeof make !== 'string' || !make.trim())) {
    return 'Make cannot be empty';
  }
  if (model !== undefined && (typeof model !== 'string' || !model.trim())) {
    return 'Model cannot be empty';
  }
  if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
    return 'Category cannot be empty';
  }
  if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price <= 0)) {
    return 'Price must be a valid number greater than zero';
  }
  if (quantity !== undefined && (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0)) {
    return 'Quantity must be a non-negative integer';
  }

  const currentYear = new Date().getFullYear();
  if (year !== undefined && year !== null) {
    if (typeof year !== 'number' || year < 1990 || year > currentYear + 1) {
      return `Year must be between 1990 and ${currentYear + 1}`;
    }
  }

  if (condition !== undefined && condition !== null) {
    if (condition !== 'New' && condition !== 'Used') {
      return "Condition must be 'New' or 'Used'";
    }
  }

  if (features !== undefined && features !== null && !Array.isArray(features)) {
    return 'Features must be an array of strings';
  }

  if (images !== undefined && images !== null && !Array.isArray(images)) {
    return 'Images must be an array of image URL strings';
  }

  return null;
}

module.exports = {
  validateCreateVehicleInput,
  validateUpdateVehicleInput
};
