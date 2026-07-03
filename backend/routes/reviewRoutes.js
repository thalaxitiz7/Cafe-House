const express = require('express');
const router = express.Router();
const { reviewValidationRules, handleValidationErrors } = require('../middleware/validation');
const { verifyUserToken } = require('../middleware/auth');
const { getCafeReviews, createReview, updateReview, deleteReview, markHelpful } = require('../controllers/reviewController');

/**
 * Review Routes
 * GET /api/reviews/cafe/:cafeId - Get cafe reviews
 * POST /api/reviews - Create review (User only)
 * PUT /api/reviews/:id - Update review (User only)
 * DELETE /api/reviews/:id - Delete review (User only)
 * POST /api/reviews/:id/helpful - Mark review as helpful (User only)
 */

// Get cafe reviews
router.get('/cafe/:cafeId', getCafeReviews);

// Create review (User only)
router.post(
  '/',
  verifyUserToken,
  reviewValidationRules(),
  handleValidationErrors,
  createReview
);

// Update review (User only)
router.put(
  '/:id',
  verifyUserToken,
  reviewValidationRules(),
  handleValidationErrors,
  updateReview
);

// Delete review (User only)
router.delete('/:id', verifyUserToken, deleteReview);

// Mark review as helpful (User only)
router.post('/:id/helpful', verifyUserToken, markHelpful);

module.exports = router;
