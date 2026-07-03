const CONSTANTS = require('../config/constants');

/**
 * Error Handler Middleware
 * Handles errors and formats responses
 */

/**
 * Global error handler
 * @middleware errorHandler
 * @param {Error} error - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const errorHandler = (error, req, res, next) => {
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: CONSTANTS.MESSAGES.ERROR_INVALID_TOKEN,
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Token has expired',
    });
  }

  // Default error
  const statusCode = error.statusCode || CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = error.message || CONSTANTS.MESSAGES.ERROR_SERVER;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * 404 Not Found handler
 * @middleware notFoundHandler
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const notFoundHandler = (req, res) => {
  res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 * @function asyncHandler
 * @param {Function} fn - Async function
 * @returns {Function} Wrapped function
 */
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
