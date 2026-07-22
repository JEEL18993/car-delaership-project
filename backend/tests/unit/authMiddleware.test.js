const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin } = require('../../src/middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_dealership_2026';

describe('Authorization Middleware (Unit Tests)', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('authenticateToken', () => {
    test('should allow a request with a valid JWT and attach decoded user to req.user', () => {
      const payload = { id: 'u123', email: 'user@example.com', role: 'user' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('u123');
      expect(req.user.email).toBe('user@example.com');
      expect(req.user.role).toBe('user');
    });

    test('should reject a request without an authorization header or token', () => {
      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token required'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject a request with an invalid token format or bad signature', () => {
      req.headers.authorization = 'Bearer invalid-token-string';

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject an expired token', () => {
      const token = jwt.sign({ id: 'u123', role: 'user' }, JWT_SECRET, { expiresIn: '-1s' });
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    test('should allow access if req.user role is admin', () => {
      req.user = { id: 'admin1', role: 'admin' };

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should reject normal users with HTTP 403 Forbidden', () => {
      req.user = { id: 'user1', role: 'user' };

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Admin role required'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject unauthenticated requests (missing req.user)', () => {
      req.user = undefined;

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
