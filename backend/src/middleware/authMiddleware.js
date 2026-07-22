const jwt = require('jsonwebtoken');
const { requireAdmin } = require('./roleMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_dealership_2026';

/**
 * Middleware to authenticate requests using JWT Bearer token.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

module.exports = {
  authenticateToken,
  requireAdmin
};
