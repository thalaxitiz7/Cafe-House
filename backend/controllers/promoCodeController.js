const PromoCode = require('../models/PromoCode');
const Cafe = require('../models/Cafe');
const CONSTANTS = require('../config/constants');

/**
 * PromoCode Controller
 * Handles promo code operations
 */

/**
 * Get all promo codes (Admin only)
 * @async
 * @function getAllPromoCodes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getAllPromoCodes = async (req, res, next) => {
  try {
    const { cafeId } = req.query;

    let query = {};
    if (cafeId) {
      query.cafeId = cafeId;
    }

    const promoCodes = await PromoCode.find(query)
      .populate('cafeId', 'name')
      .sort({ createdAt: -1 });

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { promoCodes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get promo code details
 * @async
 * @function getPromoCodeByCode
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getPromoCodeByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() }).populate('cafeId', 'name');

    if (!promoCode) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Invalid promo code',
      });
    }

    if (!promoCode.isValid()) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'Promo code has expired or is no longer valid',
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_FETCH,
      data: { promoCode },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create promo code (Admin only)
 * @async
 * @function createPromoCode
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createPromoCode = async (req, res, next) => {
  try {
    const { cafeId, code, description, discountType, discountValue, validFrom, validUntil, minPurchaseAmount, maxUses } = req.body;

    // Check if cafe exists
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Cafe not found',
      });
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: 'Promo code already exists',
      });
    }

    const promoCode = await PromoCode.create({
      cafeId,
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      validFrom,
      validUntil,
      minPurchaseAmount,
      maxUses,
    });

    await promoCode.populate('cafeId', 'name');

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_CREATE,
      data: { promoCode },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update promo code (Admin only)
 * @async
 * @function updatePromoCode
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updatePromoCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing code
    delete updates.code;

    const promoCode = await PromoCode.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('cafeId', 'name');

    if (!promoCode) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_UPDATE,
      data: { promoCode },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete promo code (Admin only)
 * @async
 * @function deletePromoCode
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deletePromoCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    const promoCode = await PromoCode.findByIdAndDelete(id);

    if (!promoCode) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_DELETE,
      data: { promoCodeId: id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPromoCodes,
  getPromoCodeByCode,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
};
