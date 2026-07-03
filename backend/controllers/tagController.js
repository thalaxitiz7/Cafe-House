const Tag = require('../models/Tag');
const Cafe = require('../models/Cafe');
const CONSTANTS = require('../config/constants');

/**
 * Tag Controller
 * Handles tag CRUD operations
 */

/**
 * Get all tags
 * @async
 * @function getAllTags
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({ isActive: true }).sort({ order: 1 });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { tags },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single tag
 * @async
 * @function getTagById
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);

    if (!tag) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create tag (Admin only)
 * @async
 * @function createTag
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createTag = async (req, res, next) => {
  try {
    const { name, displayName, description, icon, color } = req.body;

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'Tag already exists',
      });
    }

    const tag = await Tag.create({
      name: name.toLowerCase(),
      displayName,
      description,
      icon,
      color,
    });

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_CREATE,
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update tag (Admin only)
 * @async
 * @function updateTag
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If updating name, make it lowercase
    if (updates.name) {
      updates.name = updates.name.toLowerCase();
    }

    const tag = await Tag.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tag (Admin only)
 * @async
 * @function deleteTag
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Remove tag from all cafes
    await Cafe.updateMany({}, { $pull: { tags: id } });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { tagId: id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
