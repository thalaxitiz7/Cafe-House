/**
 * Error Messages
 * Centralized error message constants
 */

const ERROR_MESSAGES = {
  // Authentication Errors
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 'Invalid password format',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  INVALID_TOKEN: 'Invalid or expired token',

  // Cafe Errors
  CAFE_NOT_FOUND: 'Cafe not found',
  CAFE_NAME_REQUIRED: 'Cafe name is required',
  ADDRESS_REQUIRED: 'Address is required',
  INVALID_CAFE_DATA: 'Invalid cafe data',

  // Review Errors
  REVIEW_NOT_FOUND: 'Review not found',
  INVALID_RATING: 'Rating must be between 1 and 5',
  DUPLICATE_REVIEW: 'User has already reviewed this cafe',
  REVIEW_TEXT_TOO_LONG: 'Review text exceeds maximum length',

  // Offer Errors
  OFFER_NOT_FOUND: 'Offer not found',
  INVALID_DISCOUNT: 'Invalid discount value',
  EXPIRED_OFFER: 'Offer has expired',

  // Tag Errors
  TAG_NOT_FOUND: 'Tag not found',
  TAG_ALREADY_EXISTS: 'Tag already exists',
  INVALID_TAG_NAME: 'Invalid tag name',

  // Location Errors
  LOCATION_NOT_FOUND: 'Location not found',
  LOCATION_ALREADY_EXISTS: 'Location already exists',
  INVALID_LOCATION_NAME: 'Invalid location name',

  // PromoCode Errors
  PROMO_CODE_NOT_FOUND: 'Promo code not found',
  INVALID_PROMO_CODE: 'Invalid promo code',
  EXPIRED_PROMO_CODE: 'Promo code has expired',
  PROMO_CODE_ALREADY_USED: 'Promo code already used',
  PROMO_CODE_LIMIT_REACHED: 'Promo code usage limit reached',

  // File Errors
  NO_FILE_PROVIDED: 'No file provided',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_UPLOAD_FAILED: 'File upload failed',

  // Validation Errors
  INVALID_REQUEST: 'Invalid request',
  VALIDATION_FAILED: 'Validation failed',
  MISSING_REQUIRED_FIELD: 'Missing required field',

  // Server Errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  OPERATION_FAILED: 'Operation failed',

  // General Errors
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  BAD_REQUEST: 'Bad request',
};

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Signup successful',
  LOGOUT_SUCCESS: 'Logout successful',
  CREATE_SUCCESS: 'Created successfully',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  FETCH_SUCCESS: 'Fetched successfully',
  UPLOAD_SUCCESS: 'Upload successful',
  SAVE_SUCCESS: 'Saved successfully',
};

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
