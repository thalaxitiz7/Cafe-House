const { body, validationResult } = require('express-validator');
const CONSTANTS = require('../config/constants');

/**
 * Validation Middleware
 * Handles request validation rules
 */

/**
 * Handle validation errors
 * @middleware handleValidationErrors
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Auth validation rules
 * @function authValidationRules
 * @returns {Array} Express validator rules
 */
const authValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName')
      .optional()
      .trim(),
  ];
};

/**
 * Cafe validation rules
 * @function cafeValidationRules
 * @returns {Array} Express validator rules
 */
const cafeValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Cafe name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage('Description must not exceed 5000 characters'),
    body('location.address')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Address cannot be empty'),
  ];
};

/**
 * Review validation rules
 * @function reviewValidationRules
 * @returns {Array} Express validator rules
 */
const reviewValidationRules = () => {
  return [
    body('cafeId')
      .isMongoId()
      .withMessage('Invalid cafe ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Title must not exceed 100 characters'),
    body('text')
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage('Review text must not exceed 5000 characters'),
  ];
};

/**
 * Offer validation rules
 * @function offerValidationRules
 * @returns {Array} Express validator rules
 */
const offerValidationRules = () => {
  return [
    body('cafeId')
      .isMongoId()
      .withMessage('Invalid cafe ID'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Offer title is required')
      .isLength({ max: 100 })
      .withMessage('Title must not exceed 100 characters'),
    body('validFrom')
      .isISO8601()
      .withMessage('Invalid start date'),
    body('validUntil')
      .isISO8601()
      .withMessage('Invalid end date'),
  ];
};

/**
 * Tag validation rules
 * @function tagValidationRules
 * @returns {Array} Express validator rules
 */
const tagValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tag name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('displayName')
      .trim()
      .notEmpty()
      .withMessage('Display name is required'),
    body('color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Invalid color format'),
  ];
};

/**
 * Location validation rules
 * @function locationValidationRules
 * @returns {Array} Express validator rules
 */
const locationValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Location name is required'),
    body('coordinates.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be [longitude, latitude]'),
  ];
};

/**
 * PromoCode validation rules
 * @function promoCodeValidationRules
 * @returns {Array} Express validator rules
 */
const promoCodeValidationRules = () => {
  return [
    body('cafeId')
      .isMongoId()
      .withMessage('Invalid cafe ID'),
    body('code')
      .trim()
      .toUpperCase()
      .matches(/^[A-Z0-9]{4,20}$/)
      .withMessage('Code must be 4-20 alphanumeric characters'),
    body('discountType')
      .isIn(['percentage', 'amount'])
      .withMessage('Invalid discount type'),
    body('discountValue')
      .isFloat({ min: 0 })
      .withMessage('Discount value must be positive'),
    body('validFrom')
      .isISO8601()
      .withMessage('Invalid start date'),
    body('validUntil')
      .isISO8601()
      .withMessage('Invalid end date'),
  ];
};

module.exports = {
  handleValidationErrors,
  authValidationRules,
  cafeValidationRules,
  reviewValidationRules,
  offerValidationRules,
  tagValidationRules,
  locationValidationRules,
  promoCodeValidationRules,
};
