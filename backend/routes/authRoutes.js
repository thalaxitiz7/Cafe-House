const express = require('express');
const router = express.Router();
const { authValidationRules, handleValidationErrors } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimit');
const { userSignup, userLogin, adminLogin, verifyToken } = require('../controllers/authController');
const { verifyUserToken, verifyAdminToken } = require('../middleware/auth');

/**
 * Auth Routes
 * POST /api/auth/user/signup - User signup
 * POST /api/auth/user/login - User login
 * POST /api/auth/admin/login - Admin login
 * GET /api/auth/verify - Verify token
 */

// User signup
router.post(
  '/user/signup',
  authLimiter,
  authValidationRules(),
  handleValidationErrors,
  userSignup
);

// User login
router.post(
  '/user/login',
  authLimiter,
  authValidationRules(),
  handleValidationErrors,
  userLogin
);

// Admin login
router.post(
  '/admin/login',
  authLimiter,
  authValidationRules(),
  handleValidationErrors,
  adminLogin
);

// Verify token
router.get(
  '/verify',
  verifyUserToken,
  verifyToken
);

module.exports = router;
