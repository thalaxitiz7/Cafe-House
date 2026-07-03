const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');

/**
 * Authentication Middleware
 * Verifies JWT tokens and sets user context
 */

/**
 * Verify user token
 * @middleware verifyUserToken
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');

    // Check if token is for admin (should not be)
    if (decoded.isAdmin) {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_FORBIDDEN,
      });
    }

    req.userId = decoded.userId;
    req.userRole = 'user';
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Token has expired',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_INVALID_TOKEN,
      });
    }
    res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: CONSTANTS.MESSAGES.ERROR_UNAUTHORIZED,
    });
  }
};

/**
 * Verify admin token
 * @middleware verifyAdminToken
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');

    // Check if token is for admin
    if (!decoded.isAdmin) {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_FORBIDDEN,
      });
    }

    req.userId = decoded.userId;
    req.userRole = 'admin';
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Token has expired',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_INVALID_TOKEN,
      });
    }
    res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: CONSTANTS.MESSAGES.ERROR_UNAUTHORIZED,
    });
  }
};

/**
 * Optional user token verification
 * Allows requests with or without token
 * @middleware optionalUserToken
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const optionalUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      // Token not provided, continue as guest
      req.userId = null;
      req.userRole = 'guest';
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');

    if (decoded.isAdmin) {
      req.userRole = 'admin';
    } else {
      req.userRole = 'user';
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    // Invalid token, continue as guest
    req.userId = null;
    req.userRole = 'guest';
    next();
  }
};

module.exports = {
  verifyUserToken,
  verifyAdminToken,
  optionalUserToken,
};
