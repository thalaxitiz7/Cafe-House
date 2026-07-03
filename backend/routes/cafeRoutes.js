const express = require('express');
const router = express.Router();
const { cafeValidationRules, handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken, optionalUserToken } = require('../middleware/auth');
const {
  getAllCafes,
  getCafeById,
  createCafe,
  updateCafe,
  deleteCafe,
  getFeaturedCafes,
  getTopRatedCafes,
  getNewestCafes,
} = require('../controllers/cafeController');

/**
 * Cafe Routes
 * GET /api/cafes - Get all cafes with filters
 * GET /api/cafes/featured - Get featured cafes
 * GET /api/cafes/top-rated - Get top rated cafes
 * GET /api/cafes/newest - Get newest cafes
 * GET /api/cafes/:id - Get cafe by ID
 * POST /api/cafes - Create cafe (Admin only)
 * PUT /api/cafes/:id - Update cafe (Admin only)
 * DELETE /api/cafes/:id - Delete cafe (Admin only)
 */

// Get all cafes with search and filters
router.get('/', optionalUserToken, getAllCafes);

// Get featured cafes
router.get('/featured', getFeaturedCafes);

// Get top rated cafes
router.get('/top-rated', getTopRatedCafes);

// Get newest cafes
router.get('/newest', getNewestCafes);

// Get cafe by ID
router.get('/:id', optionalUserToken, getCafeById);

// Create cafe (Admin only)
router.post(
  '/',
  verifyAdminToken,
  cafeValidationRules(),
  handleValidationErrors,
  createCafe
);

// Update cafe (Admin only)
router.put(
  '/:id',
  verifyAdminToken,
  cafeValidationRules(),
  handleValidationErrors,
  updateCafe
);

// Delete cafe (Admin only)
router.delete('/:id', verifyAdminToken, deleteCafe);

module.exports = router;
