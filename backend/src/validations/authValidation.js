/**
 * Validates user registration payload.
 * Returns error message string if invalid, or null if valid.
 */
function validateRegisterInput({ name, email, password } = {}) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return 'Invalid email format';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return null;
}

/**
 * Validates user login payload.
 * Returns error message string if invalid, or null if valid.
 */
function validateLoginInput({ email, password } = {}) {
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return 'Email and password are required';
  }
  return null;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
