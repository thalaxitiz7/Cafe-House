const mongoose = require('mongoose');

/**
 * Cafe Schema
 * Stores cafe information, ratings, facilities, and relationships
 */
const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cafe name is required'],
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    mainImage: {
      url: String,
      publicId: String,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    location: {
      address: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      postalCode: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      locationTag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    businessHours: {
      monday: { openTime: String, closeTime: String },
      tuesday: { openTime: String, closeTime: String },
      wednesday: { openTime: String, closeTime: String },
      thursday: { openTime: String, closeTime: String },
      friday: { openTime: String, closeTime: String },
      saturday: { openTime: String, closeTime: String },
      sunday: { openTime: String, closeTime: String },
    },
    facilities: {
      wifi: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      outdoor: { type: Boolean, default: false },
      indoor: { type: Boolean, default: true },
      petFriendly: { type: Boolean, default: false },
      airConditioned: { type: Boolean, default: true },
      smoking: { type: Boolean, default: false },
      bikeParkingAvailable: { type: Boolean, default: false },
    },
    paymentMethods: {
      cash: { type: Boolean, default: true },
      card: { type: Boolean, default: false },
      qrPayment: { type: Boolean, default: false },
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      breakdown: {
        fiveStars: { type: Number, default: 0 },
        fourStars: { type: Number, default: 0 },
        threeStars: { type: Number, default: 0 },
        twoStars: { type: Number, default: 0 },
        oneStar: { type: Number, default: 0 },
      },
    },
    ranking: {
      points: {
        type: Number,
        default: 0,
      },
      stars: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
      },
    ],
    promoCodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromoCode',
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
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
    collection: 'cafes',
  }
);

/**
 * Geospatial index for location-based queries
 */
cafeSchema.index({ 'location.coordinates': '2dsphere' });
cafeSchema.index({ 'rating.average': -1 });
cafeSchema.index({ 'ranking.points': -1 });

/**
 * Increment view count
 * @method incrementViewCount
 * @returns {Promise<void>}
 */
cafeSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  return await this.save();
};

/**
 * Update star rating based on ranking points
 * @method updateStarRating
 * @returns {Promise<void>}
 */
cafeSchema.methods.updateStarRating = async function () {
  const points = this.ranking.points;
  if (points >= 980) {
    this.ranking.stars = 5;
  } else if (points >= 900) {
    this.ranking.stars = 4;
  } else if (points >= 800) {
    this.ranking.stars = 3;
  } else if (points >= 700) {
    this.ranking.stars = 2;
  } else {
    this.ranking.stars = 1;
  }
  return await this.save();
};

/**
 * Add review to cafe
 * @method addReview
 * @param {ObjectId} reviewId - Review ID
 * @returns {Promise<void>}
 */
cafeSchema.methods.addReview = async function (reviewId) {
  if (!this.reviews.includes(reviewId)) {
    this.reviews.push(reviewId);
    return await this.save();
  }
};

module.exports = mongoose.model('Cafe', cafeSchema);
