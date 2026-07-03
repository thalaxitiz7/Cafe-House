/**
 * Input Validators
 * Functions to validate various input types
 */

/**
 * Validate email format
 * @function validateEmail
 * @param {String} email - Email to validate
 * @returns {Boolean}
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @function validatePassword
 * @param {String} password - Password to validate
 * @returns {Object} - { isValid: Boolean, errors: Array }
 */
const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate URL format
 * @function validateURL
 * @param {String} url - URL to validate
 * @returns {Boolean}
 */
const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate phone number
 * @function validatePhone
 * @param {String} phone - Phone number to validate
 * @returns {Boolean}
 */
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate MongoDB ObjectId
 * @function validateObjectId
 * @param {String} id - ID to validate
 * @returns {Boolean}
 */
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate hex color
 * @function validateHexColor
 * @param {String} color - Color to validate
 * @returns {Boolean}
 */
const validateHexColor = (color) => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

/**
 * Validate rating value
 * @function validateRating
 * @param {Number} rating - Rating to validate
 * @returns {Boolean}
 */
const validateRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

/**
 * Validate image file
 * @function validateImageFile
 * @param {Object} file - File object from multer
 * @returns {Object} - { isValid: Boolean, error: String }
 */
const validateImageFile = (file) => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return { isValid: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
  }

  if (file.size > MAX_SIZE) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  return { isValid: true };
};

/**
 * Validate date range
 * @function validateDateRange
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} - { isValid: Boolean, error: String }
 */
const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (start >= end) {
    return { isValid: false, error: 'Start date must be before end date' };
  }

  return { isValid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateURL,
  validatePhone,
  validateObjectId,
  validateHexColor,
  validateRating,
  validateImageFile,
  validateDateRange,
};
