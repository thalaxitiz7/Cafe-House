/**
 * Application Constants
 */

const CONSTANTS = {
  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },

  // Rating Limits
  RATING: {
    MIN: 1,
    MAX: 5,
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  },

  // Cache Duration (in seconds)
  CACHE_DURATION: {
    SHORT: 300, // 5 minutes
    MEDIUM: 900, // 15 minutes
    LONG: 3600, // 1 hour
  },

  // Cafe Ranking Stars
  CAFE_RANKING: {
    FIVE_STARS: 980,
    FOUR_STARS: 900,
    THREE_STARS: 800,
  },

  // Messages
  MESSAGES: {
    // Success
    SUCCESS_LOGIN: 'Login successful',
    SUCCESS_SIGNUP: 'Signup successful',
    SUCCESS_LOGOUT: 'Logout successful',
    SUCCESS_CREATE: 'Created successfully',
    SUCCESS_UPDATE: 'Updated successfully',
    SUCCESS_DELETE: 'Deleted successfully',

    // Errors
    ERROR_INVALID_EMAIL: 'Invalid email address',
    ERROR_PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    ERROR_USER_EXISTS: 'User already exists',
    ERROR_USER_NOT_FOUND: 'User not found',
    ERROR_INVALID_CREDENTIALS: 'Invalid email or password',
    ERROR_UNAUTHORIZED: 'Unauthorized access',
    ERROR_FORBIDDEN: 'Forbidden access',
    ERROR_NOT_FOUND: 'Resource not found',
    ERROR_INVALID_REQUEST: 'Invalid request',
    ERROR_SERVER: 'Internal server error',
    ERROR_INVALID_TOKEN: 'Invalid or expired token',
    ERROR_FILE_TOO_LARGE: 'File size exceeds maximum limit',
    ERROR_INVALID_FILE_TYPE: 'Invalid file type',
  },
};

module.exports = CONSTANTS;
