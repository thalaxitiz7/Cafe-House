const Review = require('../models/Review');
const Cafe = require('../models/Cafe');
const { getPaginationParams } = require('../utils/helpers');
const CONSTANTS = require('../config/constants');

/**
 * Review Controller
 * Handles review operations
 */

/**
 * Get cafe reviews
 * @async
 * @function getCafeReviews
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getCafeReviews = async (req, res, next) => {
  try {
    const { cafeId } = req.params;
    const { page, limit } = req.query;

    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const reviews = await Review.find({ cafeId, status: 'approved' })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    const total = await Review.countDocuments({ cafeId, status: 'approved' });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: {
        reviews,
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
 * Create review
 * @async
 * @function createReview
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createReview = async (req, res, next) => {
  try {
    const { cafeId, rating, title, text } = req.body;
    const userId = req.userId;

    // Check if cafe exists
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Cafe not found',
      });
    }

    // Check if user already reviewed this cafe
    const existingReview = await Review.findOne({ cafeId, userId });
    if (existingReview) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'You have already reviewed this cafe',
      });
    }

    // Create review
    const review = await Review.create({
      cafeId,
      userId,
      rating,
      title,
      text,
    });

    await review.populate('userId', 'firstName lastName avatar');

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_CREATE,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update review
 * @async
 * @function updateReview
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, text } = req.body;
    const userId = req.userId;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Check ownership
    if (review.userId.toString() !== userId) {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_FORBIDDEN,
      });
    }

    // Update review
    review.rating = rating;
    review.title = title;
    review.text = text;
    await review.save();

    await review.populate('userId', 'firstName lastName avatar');

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review
 * @async
 * @function deleteReview
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    // Check ownership or admin
    if (review.userId.toString() !== userId && req.userRole !== 'admin') {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_FORBIDDEN,
      });
    }

    await Review.deleteOne({ _id: id });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { reviewId: id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark review as helpful
 * @async
 * @function markHelpful
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    if (helpful) {
      review.helpful += 1;
    } else {
      review.unhelpful += 1;
    }

    await review.save();

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCafeReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
};
