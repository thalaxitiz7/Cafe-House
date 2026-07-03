const Cafe = require('../models/Cafe');
const Review = require('../models/Review');
const Tag = require('../models/Tag');
const Location = require('../models/Location');
const { getPaginationParams, buildFilterQuery, buildSortQuery, generateSearchQuery } = require('../utils/helpers');
const CONSTANTS = require('../config/constants');

/**
 * Cafe Controller
 * Handles cafe CRUD operations
 */

/**
 * Get all cafes with search and filters
 * @async
 * @function getAllCafes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getAllCafes = async (req, res, next) => {
  try {
    const { page, limit, search, sort, order, ...filters } = req.query;
    
    // Get pagination params
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    // Build query
    let query = buildFilterQuery(filters);

    // Add search if provided
    if (search) {
      query = { ...query, ...generateSearchQuery(search) };
    }

    // Get sort order
    const sortQuery = buildSortQuery(sort, order);

    // Execute query
    const cafes = await Cafe.find(query)
      .populate('tags', 'name displayName color')
      .populate('location.locationTag', 'name')
      .sort(sortQuery)
      .skip(skip)
      .limit(pageLimit)
      .lean();

    // Get total count
    const total = await Cafe.countDocuments(query);

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: {
        cafes,
        pagination: {
          total,
          pages: Math.ceil(total / pageLimit),
          current: parseInt(page) || 1,
          limit: pageLimit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single cafe by ID
 * @async
 * @function getCafeById
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getCafeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cafe = await Cafe.findById(id)
      .populate('tags', 'name displayName color')
      .populate('location.locationTag', 'name coordinates')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'firstName lastName avatar',
        },
      })
      .populate('offers')
      .populate('promoCodes');

    if (!cafe) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Increment view count
    await cafe.incrementViewCount();

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { cafe },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new cafe (Admin only)
 * @async
 * @function createCafe
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createCafe = async (req, res, next) => {
  try {
    const { name, description, location, contact, businessHours, facilities, paymentMethods, tags, ranking } = req.body;

    // Check if cafe already exists
    const existingCafe = await Cafe.findOne({ name });
    if (existingCafe) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'Cafe with this name already exists',
      });
    }

    // Create cafe
    const cafe = await Cafe.create({
      name,
      description,
      location,
      contact,
      businessHours,
      facilities,
      paymentMethods,
      tags,
      ranking,
    });

    await cafe.populate('tags', 'name displayName color');

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_CREATE,
      data: { cafe },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cafe (Admin only)
 * @async
 * @function updateCafe
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateCafe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const cafe = await Cafe.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('tags', 'name displayName color');

    if (!cafe) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Update star rating if ranking points changed
    if (updates.ranking && updates.ranking.points) {
      await cafe.updateStarRating();
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { cafe },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete cafe (Admin only)
 * @async
 * @function deleteCafe
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteCafe = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cafe = await Cafe.findByIdAndDelete(id);

    if (!cafe) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Delete associated reviews
    await Review.deleteMany({ cafeId: id });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { cafeId: id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured cafes
 * @async
 * @function getFeaturedCafes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getFeaturedCafes = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const cafes = await Cafe.find({ isFeatured: true, isActive: true })
      .populate('tags', 'name displayName')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { cafes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get top rated cafes
 * @async
 * @function getTopRatedCafes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getTopRatedCafes = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const cafes = await Cafe.find({ isActive: true })
      .populate('tags', 'name displayName')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit));

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { cafes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get newest cafes
 * @async
 * @function getNewestCafes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getNewestCafes = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const cafes = await Cafe.find({ isActive: true })
      .populate('tags', 'name displayName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { cafes },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCafes,
  getCafeById,
  createCafe,
  updateCafe,
  deleteCafe,
  getFeaturedCafes,
  getTopRatedCafes,
  getNewestCafes,
};
