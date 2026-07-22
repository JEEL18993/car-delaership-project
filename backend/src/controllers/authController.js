const authService = require('../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../validations/authValidation');

/**
 * Controller endpoint for POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const userData = await authService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData,
      data: userData
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller endpoint for POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { token, user } = await authService.loginUser(req.body);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};
