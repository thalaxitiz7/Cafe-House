/**
 * Input Sanitizers
 * Functions to sanitize and clean input data
 */

/**
 * Sanitize string input
 * Remove leading/trailing whitespace and escape HTML
 * @function sanitizeString
 * @param {String} str - String to sanitize
 * @returns {String}
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>"']/g, char => {
      const map = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return map[char];
    });
};

/**
 * Sanitize email
 * @function sanitizeEmail
 * @param {String} email - Email to sanitize
 * @returns {String}
 */
const sanitizeEmail = (email) => {
  return email.toLowerCase().trim();
};

/**
 * Sanitize object by sanitizing all string properties
 * @function sanitizeObject
 * @param {Object} obj - Object to sanitize
 * @returns {Object}
 */
const sanitizeObject = (obj) => {
  const sanitized = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }

  return sanitized;
};

/**
 * Remove sensitive fields from object
 * @function removeSensitiveFields
 * @param {Object} obj - Object to clean
 * @param {Array} fields - Fields to remove
 * @returns {Object}
 */
const removeSensitiveFields = (obj, fields = ['password', 'passwordReset', '__v']) => {
  const cleaned = { ...obj };

  fields.forEach(field => {
    delete cleaned[field];
  });

  return cleaned;
};

/**
 * Sanitize query parameters
 * @function sanitizeQueryParams
 * @param {Object} query - Query object
 * @returns {Object}
 */
const sanitizeQueryParams = (query) => {
  const sanitized = {};

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      if (typeof query[key] === 'string') {
        sanitized[key] = sanitizeString(query[key]);
      } else {
        sanitized[key] = query[key];
      }
    }
  }

  return sanitized;
};

/**
 * Prevent NoSQL injection by escaping dangerous characters
 * @function preventNoSQLInjection
 * @param {Object} obj - Object to clean
 * @returns {Object}
 */
const preventNoSQLInjection = (obj) => {
  const clean = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Remove keys starting with $
      if (typeof key === 'string' && key.startsWith('$')) {
        continue;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        clean[key] = preventNoSQLInjection(obj[key]);
      } else if (typeof obj[key] === 'string') {
        // Remove $ from string values
        clean[key] = obj[key].replace(/\$/g, '');
      } else {
        clean[key] = obj[key];
      }
    }
  }

  return clean;
};

module.exports = {
  sanitizeString,
  sanitizeEmail,
  sanitizeObject,
  removeSensitiveFields,
  sanitizeQueryParams,
  preventNoSQLInjection,
};
