const express = require('express');
const router = express.Router();
const { offerValidationRules, handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken } = require('../middleware/auth');
const {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getFeaturedOffers,
} = require('../controllers/offerController');

/**
 * Offer Routes
 * GET /api/offers - Get all offers
 * GET /api/offers/featured - Get featured offers
 * GET /api/offers/:id - Get offer by ID
 * POST /api/offers - Create offer (Admin only)
 * PUT /api/offers/:id - Update offer (Admin only)
 * DELETE /api/offers/:id - Delete offer (Admin only)
 */

// Get all offers
router.get('/', getAllOffers);

// Get featured offers
router.get('/featured', getFeaturedOffers);

// Get offer by ID
router.get('/:id', getOfferById);

// Create offer (Admin only)
router.post(
  '/',
  verifyAdminToken,
  offerValidationRules(),
  handleValidationErrors,
  createOffer
);

// Update offer (Admin only)
router.put(
  '/:id',
  verifyAdminToken,
  offerValidationRules(),
  handleValidationErrors,
  updateOffer
);

// Delete offer (Admin only)
router.delete('/:id', verifyAdminToken, deleteOffer);

module.exports = router;
