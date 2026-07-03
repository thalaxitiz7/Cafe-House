const { validationResult, body, param, query } = require('express-validator');
const CONSTANTS = require('../config/constants');

/**
 * Validation Error Handler Middleware
 * Checks for validation errors and returns them
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
 * Auth Validation Rules
 */
const authValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage(CONSTANTS.MESSAGES.ERROR_INVALID_EMAIL),
    body('password')
      .isLength({ min: 6 })
      .withMessage(CONSTANTS.MESSAGES.ERROR_PASSWORD_TOO_SHORT),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .optional()
      .trim(),
  ];
};

/**
 * Cafe Validation Rules
 */
const cafeValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Cafe name is required')
      .isLength({ max: 100 })
      .withMessage('Cafe name cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('location.address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),
    body('contact.phone')
      .optional()
      .trim(),
    body('contact.email')
      .optional()
      .isEmail()
      .normalizeEmail(),
    body('businessHours.openTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid time format (HH:MM)'),
    body('businessHours.closeTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid time format (HH:MM)'),
  ];
};

/**
 * Review Validation Rules
 */
const reviewValidationRules = () => {
  return [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('text')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Review text cannot exceed 1000 characters'),
  ];
};

/**
 * Offer Validation Rules
 */
const offerValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Offer title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('discountPercentage')
      .isInt({ min: 0, max: 100 })
      .withMessage('Discount must be between 0 and 100'),
    body('validFrom')
      .isISO8601()
      .withMessage('Valid start date is required'),
    body('validUntil')
      .isISO8601()
      .withMessage('Valid end date is required'),
  ];
};

/**
 * Tag Validation Rules
 */
const tagValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tag name is required')
      .isLength({ max: 50 })
      .withMessage('Tag name cannot exceed 50 characters'),
    body('displayName')
      .trim()
      .notEmpty()
      .withMessage('Display name is required'),
    body('color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Invalid hex color'),
  ];
};

/**
 * Location Validation Rules
 */
const locationValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Location name is required')
      .isLength({ max: 100 })
      .withMessage('Location name cannot exceed 100 characters'),
  ];
};

/**
 * PromoCode Validation Rules
 */
const promoCodeValidationRules = () => {
  return [
    body('code')
      .toUpperCase()
      .trim()
      .notEmpty()
      .withMessage('Promo code is required')
      .matches(/^[A-Z0-9]{4,20}$/)
      .withMessage('Promo code must be 4-20 alphanumeric characters'),
    body('discountType')
      .isIn(['percentage', 'amount'])
      .withMessage('Invalid discount type'),
    body('discountValue')
      .isFloat({ min: 0 })
      .withMessage('Discount value must be a positive number'),
    body('validFrom')
      .isISO8601()
      .withMessage('Valid start date is required'),
    body('validUntil')
      .isISO8601()
      .withMessage('Valid end date is required'),
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
