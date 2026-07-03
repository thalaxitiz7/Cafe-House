const mongoose = require('mongoose');

/**
 * Offer Schema
 * Stores promotional offers for cafes
 */
const offerSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: [true, 'Cafe ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount must be at least 0'],
      max: [100, 'Discount cannot exceed 100'],
    },
    discountAmount: Number,
    offerType: {
      type: String,
      enum: ['percentage', 'amount', 'bogo', 'free-item'],
      default: 'percentage',
    },
    banner: {
      url: String,
      publicId: String,
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
    applicableItems: [String], // Specific menu items
    terms: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'offers',
  }
);

/**
 * Create indexes for efficient querying
 */
offerSchema.index({ cafeId: 1 });
offerSchema.index({ validFrom: 1, validUntil: 1 });
offerSchema.index({ isActive: 1 });

/**
 * Check if offer is expired
 * @method isExpired
 * @returns {Boolean}
 */
offerSchema.methods.isExpired = function () {
  return new Date() > this.validUntil;
};

/**
 * Check if offer is active
 * @method isOfferActive
 * @returns {Boolean}
 */
offerSchema.methods.isOfferActive = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.maxUses || this.usageCount < this.maxUses)
  );
};

/**
 * Get remaining days until expiration
 * @method getDaysUntilExpiry
 * @returns {Number}
 */
offerSchema.methods.getDaysUntilExpiry = function () {
  const now = new Date();
  const diff = this.validUntil - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Increment usage count
 * @method incrementUsage
 * @returns {Promise<void>}
 */
offerSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  return await this.save();
};

module.exports = mongoose.model('Offer', offerSchema);
