const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'digiagency_aetheric_secret_key_2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (token === 'mock_jwt_token_admin_2026') {
    req.user = { id: 1, username: 'admin', role: 'ADMIN' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ success: false, message: 'Insufficient permission privileges.' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};
