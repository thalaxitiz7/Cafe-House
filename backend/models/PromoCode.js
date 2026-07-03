const mongoose = require('mongoose');

/**
 * PromoCode Schema
 * Stores promotional codes for cafes
 */
const promoCodeSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: [true, 'Cafe ID is required'],
    },
    code: {
      type: String,
      required: [true, 'Promo code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]{4,20}$/, 'Promo code must be 4-20 alphanumeric characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'amount'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    validFrom: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    validUntil: {
      type: Date,
      required: [true, 'End date is required'],
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxUses: Number,
    usageCount: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        usedAt: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'promoCodes',
  }
);

/**
 * Create indexes
 */
promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ cafeId: 1 });
promoCodeSchema.index({ validFrom: 1, validUntil: 1 });

/**
 * Check if promo code is valid and active
 * @method isValid
 * @returns {Boolean}
 */
promoCodeSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.maxUses || this.usageCount < this.maxUses)
  );
};

/**
 * Check if user has already used this code
 * @method hasUserUsed
 * @param {String} userId - User ID
 * @returns {Boolean}
 */
promoCodeSchema.methods.hasUserUsed = function (userId) {
  return this.usedBy.some(usage => usage.userId.toString() === userId.toString());
};

/**
 * Mark code as used by user
 * @method markAsUsedBy
 * @param {String} userId - User ID
 * @returns {Promise<void>}
 */
promoCodeSchema.methods.markAsUsedBy = async function (userId) {
  this.usedBy.push({
    userId,
    usedAt: new Date(),
  });
  this.usageCount += 1;
  return await this.save();
};

/**
 * Get days until expiry
 * @method getDaysUntilExpiry
 * @returns {Number}
 */
promoCodeSchema.methods.getDaysUntilExpiry = function () {
  const now = new Date();
  const diff = this.validUntil - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('PromoCode', promoCodeSchema);
