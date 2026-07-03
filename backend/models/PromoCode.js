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
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Promo code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z0-9]{4,20}$/,
      index: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'amount'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxUses: Number,
    currentUses: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        usedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'promo_codes',
  }
);

/**
 * Check if promo code is valid
 * @method isValid
 * @returns {Boolean}
 */
promoCodeSchema.methods.isValid = function () {
  const now = new Date();
  const isDateValid = now >= this.validFrom && now <= this.validUntil;
  const isUsageValid = !this.maxUses || this.currentUses < this.maxUses;
  return isDateValid && isUsageValid;
};

module.exports = mongoose.model('PromoCode', promoCodeSchema);
