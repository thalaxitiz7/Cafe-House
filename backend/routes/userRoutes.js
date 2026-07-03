const express = require('express');
const router = express.Router();
const { verifyUserToken } = require('../middleware/auth');
const { getUserProfile, updateUserProfile, saveCafe, removeSavedCafe, getSavedCafes } = require('../controllers/userController');

/**
 * User Routes
 * GET /api/users/profile - Get user profile
 * PUT /api/users/profile - Update user profile
 * POST /api/users/saved-cafes - Save cafe
 * DELETE /api/users/saved-cafes/:cafeId - Remove saved cafe
 * GET /api/users/saved-cafes - Get user's saved cafes
 */

// Get user profile
router.get('/profile', verifyUserToken, getUserProfile);

// Update user profile
router.put('/profile', verifyUserToken, updateUserProfile);

// Save cafe
router.post('/saved-cafes', verifyUserToken, saveCafe);

// Remove saved cafe
router.delete('/saved-cafes/:cafeId', verifyUserToken, removeSavedCafe);

// Get saved cafes
router.get('/saved-cafes', verifyUserToken, getSavedCafes);

module.exports = router;
