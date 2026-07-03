const CONSTANTS = require('../config/constants');

/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(err => err.message);
    return res.status(CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: CONSTANTS.MESSAGES.ERROR_INVALID_TOKEN,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Token has expired',
    });
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_FILE_TOO_LARGE,
      });
    }
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Default error
  res.status(CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: CONSTANTS.MESSAGES.ERROR_SERVER,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

/**
 * 404 Not Found Handler
 * Should be placed after all routes
 */
const notFoundHandler = (req, res) => {
  res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
    path: req.originalUrl,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
