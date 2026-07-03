const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user/admin to request
 */

/**
 * Verify user JWT token
 * @middleware verifyUserToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: CONSTANTS.MESSAGES.ERROR_INVALID_TOKEN,
    });
  }
};

/**
 * Verify admin JWT token
 * @middleware verifyAdminToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_FORBIDDEN,
      });
    }

    req.adminId = decoded.id;
    req.adminRole = decoded.role;
    next();
  } catch (error) {
    return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: CONSTANTS.MESSAGES.ERROR_INVALID_TOKEN,
    });
  }
};

/**
 * Optional token verification
 * Doesn't fail if token is missing, but verifies if present
 * @middleware optionalUserToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
    }

    next();
  } catch (error) {
    // Silently fail and continue
    next();
  }
};

module.exports = {
  verifyUserToken,
  verifyAdminToken,
  optionalUserToken,
};
