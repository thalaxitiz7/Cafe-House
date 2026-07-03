const Location = require('../models/Location');
const Cafe = require('../models/Cafe');
const CONSTANTS = require('../config/constants');

/**
 * Location Controller
 * Handles location CRUD operations
 */

/**
 * Get all locations
 * @async
 * @function getAllLocations
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getAllLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ order: 1 });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { locations },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single location
 * @async
 * @function getLocationById
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { location },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create location (Admin only)
 * @async
 * @function createLocation
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createLocation = async (req, res, next) => {
  try {
    const { name, description, coordinates } = req.body;

    // Check if location already exists
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'Location already exists',
      });
    }

    const location = await Location.create({
      name,
      description,
      coordinates,
    });

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_CREATE,
      data: { location },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update location (Admin only)
 * @async
 * @function updateLocation
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const location = await Location.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { location },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete location (Admin only)
 * @async
 * @function deleteLocation
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Remove location from all cafes
    await Cafe.updateMany({}, { $unset: { 'location.locationTag': 1 } });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { locationId: id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
