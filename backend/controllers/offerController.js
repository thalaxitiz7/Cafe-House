const Offer = require('../models/Offer');
const Cafe = require('../models/Cafe');
const { getPaginationParams, isOfferActive } = require('../utils/helpers');
const CONSTANTS = require('../config/constants');

/**
 * Offer Controller
 * Handles offer CRUD operations
 */

/**
 * Get all offers
 * @async
 * @function getAllOffers
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getAllOffers = async (req, res, next) => {
  try {
    const { page, limit, cafeId } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    let query = { isActive: true };
    if (cafeId) {
      query.cafeId = cafeId;
    }

    const offers = await Offer.find(query)
      .populate('cafeId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    const total = await Offer.countDocuments(query);

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: {
        offers: offers.map(offer => ({
          ...offer.toObject(),
          isOfferActive: isOfferActive(offer.validFrom, offer.validUntil, offer.isActive),
        })),
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
 * Get single offer
 * @async
 * @function getOfferById
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id).populate('cafeId', 'name');

    if (!offer) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: {
        offer: {
          ...offer.toObject(),
          isOfferActive: isOfferActive(offer.validFrom, offer.validUntil, offer.isActive),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create offer (Admin only)
 * @async
 * @function createOffer
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createOffer = async (req, res, next) => {
  try {
    const { cafeId, title, description, discountPercentage, discountAmount, offerType, validFrom, validUntil, minPurchaseAmount, maxUses } = req.body;

    // Check if cafe exists
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Cafe not found',
      });
    }

    const offer = await Offer.create({
      cafeId,
      title,
      description,
      discountPercentage,
      discountAmount,
      offerType,
      validFrom,
      validUntil,
      minPurchaseAmount,
      maxUses,
    });

    await offer.populate('cafeId', 'name');

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_CREATE,
      data: { offer },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update offer (Admin only)
 * @async
 * @function updateOffer
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const offer = await Offer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('cafeId', 'name');

    if (!offer) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { offer },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete offer (Admin only)
 * @async
 * @function deleteOffer
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { offerId: id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured offers
 * @async
 * @function getFeaturedOffers
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getFeaturedOffers = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const offers = await Offer.find({ isFeatured: true, isActive: true })
      .populate('cafeId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { offers },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getFeaturedOffers,
};
