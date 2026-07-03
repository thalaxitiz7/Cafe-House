const express = require('express');
const router = express.Router();
const { tagValidationRules, handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken } = require('../middleware/auth');
const { getAllTags, getTagById, createTag, updateTag, deleteTag } = require('../controllers/tagController');

/**
 * Tag Routes
 * GET /api/tags - Get all tags
 * GET /api/tags/:id - Get tag by ID
 * POST /api/tags - Create tag (Admin only)
 * PUT /api/tags/:id - Update tag (Admin only)
 * DELETE /api/tags/:id - Delete tag (Admin only)
 */

// Get all tags
router.get('/', getAllTags);

// Get tag by ID
router.get('/:id', getTagById);

// Create tag (Admin only)
router.post(
  '/',
  verifyAdminToken,
  tagValidationRules(),
  handleValidationErrors,
  createTag
);

// Update tag (Admin only)
router.put(
  '/:id',
  verifyAdminToken,
  tagValidationRules(),
  handleValidationErrors,
  updateTag
);

// Delete tag (Admin only)
router.delete('/:id', verifyAdminToken, deleteTag);

module.exports = router;
