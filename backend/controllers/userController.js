const User = require('../models/User');
const CONSTANTS = require('../config/constants');

/**
 * User Controller
 * Handles user profile and account operations
 */

/**
 * Get user profile
 * @async
 * @function getUserProfile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select('-password')
      .populate('savedCafes', 'name mainImage rating');

    if (!user) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @async
 * @function updateUserProfile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, bio, location } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone, bio, location },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save cafe to user's saved list
 * @async
 * @function saveCafe
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const saveCafe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { cafeId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Check if already saved
    if (user.hasSavedCafe(cafeId)) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'Cafe already saved',
      });
    }

    user.savedCafes.push(cafeId);
    await user.save();

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_SAVE,
      data: { savedCafesCount: user.savedCafes.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove cafe from saved list
 * @async
 * @function removeSavedCafe
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const removeSavedCafe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { cafeId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedCafes: cafeId } },
      { new: true }
    );

    if (!user) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { savedCafesCount: user.savedCafes.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's saved cafes
 * @async
 * @function getSavedCafes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getSavedCafes = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate('savedCafes', 'name mainImage rating location');

    if (!user) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { savedCafes: user.savedCafes },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  saveCafe,
  removeSavedCafe,
  getSavedCafes,
};
