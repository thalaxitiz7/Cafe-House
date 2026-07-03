const mongoose = require('mongoose');

/**
 * Offer Schema
 * Stores cafe offers and discounts
 */
const offerSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    discountAmount: Number,
    offerType: {
      type: String,
      enum: ['percentage', 'fixed', 'freeItem', 'buyOneGetOne'],
      default: 'percentage',
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
    image: {
      url: String,
      publicId: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'offers',
  }
);

module.exports = mongoose.model('Offer', offerSchema);
