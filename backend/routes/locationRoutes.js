const express = require('express');
const router = express.Router();
const { locationValidationRules, handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken } = require('../middleware/auth');
const { getAllLocations, getLocationById, createLocation, updateLocation, deleteLocation } = require('../controllers/locationController');

/**
 * Location Routes
 * GET /api/locations - Get all locations
 * GET /api/locations/:id - Get location by ID
 * POST /api/locations - Create location (Admin only)
 * PUT /api/locations/:id - Update location (Admin only)
 * DELETE /api/locations/:id - Delete location (Admin only)
 */

// Get all locations
router.get('/', getAllLocations);

// Get location by ID
router.get('/:id', getLocationById);

// Create location (Admin only)
router.post(
  '/',
  verifyAdminToken,
  locationValidationRules(),
  handleValidationErrors,
  createLocation
);

// Update location (Admin only)
router.put(
  '/:id',
  verifyAdminToken,
  locationValidationRules(),
  handleValidationErrors,
  updateLocation
);

// Delete location (Admin only)
router.delete('/:id', verifyAdminToken, deleteLocation);

module.exports = router;
