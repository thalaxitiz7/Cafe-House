const express = require('express');
const router = express.Router();
const { promoCodeValidationRules, handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken } = require('../middleware/auth');
const { getAllPromoCodes, getPromoCodeByCode, createPromoCode, updatePromoCode, deletePromoCode } = require('../controllers/promoCodeController');

/**
 * PromoCode Routes
 * GET /api/promo-codes - Get all promo codes (Admin only)
 * GET /api/promo-codes/:code - Get promo code by code
 * POST /api/promo-codes - Create promo code (Admin only)
 * PUT /api/promo-codes/:id - Update promo code (Admin only)
 * DELETE /api/promo-codes/:id - Delete promo code (Admin only)
 */

// Get all promo codes (Admin only)
router.get('/', verifyAdminToken, getAllPromoCodes);

// Get promo code by code (Public)
router.get('/:code', getPromoCodeByCode);

// Create promo code (Admin only)
router.post(
  '/',
  verifyAdminToken,
  promoCodeValidationRules(),
  handleValidationErrors,
  createPromoCode
);

// Update promo code (Admin only)
router.put(
  '/:id',
  verifyAdminToken,
  promoCodeValidationRules(),
  handleValidationErrors,
  updatePromoCode
);

// Delete promo code (Admin only)
router.delete('/:id', verifyAdminToken, deletePromoCode);

module.exports = router;
