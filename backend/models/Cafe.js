const mongoose = require('mongoose');

/**
 * Cafe Schema
 * Stores cafe information including location, amenities, ratings, and images
 */
const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cafe name is required'],
      trim: true,
      maxlength: [100, 'Cafe name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    mainImage: {
      url: String,
      publicId: String,
    },
    gallery: [
      {
        url: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      locationTag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      googleMapEmbedUrl: String,
    },
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
    },
    businessHours: {
      openTime: String, // HH:MM format
      closeTime: String, // HH:MM format
      isOpen24Hours: {
        type: Boolean,
        default: false,
      },
      closedOn: {
        type: [String],
        default: [], // ['Monday', 'Sunday']
      },
    },
    facilities: {
      parking: {
        type: Boolean,
        default: false,
      },
      bikeParkingAvailable: {
        type: Boolean,
        default: false,
      },
      wifi: {
        type: Boolean,
        default: false,
      },
      airConditioned: {
        type: Boolean,
        default: false,
      },
      petFriendly: {
        type: Boolean,
        default: false,
      },
      smoking: {
        type: Boolean,
        default: false,
      },
      outdoor: {
        type: Boolean,
        default: false,
      },
      indoor: {
        type: Boolean,
        default: false,
      },
    },
    paymentMethods: {
      cash: {
        type: Boolean,
        default: true,
      },
      card: {
        type: Boolean,
        default: false,
      },
      qrPayment: {
        type: Boolean,
        default: false,
      },
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    menu: {
      hasMenu: {
        type: Boolean,
        default: false,
      },
      menuUrl: String,
      menuPublicId: String,
    },
    ranking: {
      points: {
        type: Number,
        default: 0,
      },
      stars: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 3,
      },
    },
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
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    savesCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
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
    collection: 'cafes',
  }
);

/**
 * Create search index for cafe fields
 */
cafeSchema.index({ name: 'text', description: 'text' });
cafeSchema.index({ 'location.address': 1 });
cafeSchema.index({ tags: 1 });
cafeSchema.index({ 'ranking.points': -1 });
cafeSchema.index({ rating: -1 });

/**
 * Calculate average rating
 * @method calculateAverageRating
 * @returns {Promise<void>}
 */
cafeSchema.methods.calculateAverageRating = async function () {
  const reviews = await mongoose.model('Review').find({ cafeId: this._id });
  
  if (reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = (sum / reviews.length).toFixed(1);
    this.rating.count = reviews.length;
  }
  
  return await this.save();
};

/**
 * Update cafe stars based on ranking points
 * @method updateStarRating
 * @returns {Promise<void>}
 */
cafeSchema.methods.updateStarRating = function () {
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
  
  return this.save();
};

/**
 * Increment view count
 * @method incrementViewCount
 * @returns {Promise<void>}
 */
cafeSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  return await this.save();
};

module.exports = mongoose.model('Cafe', cafeSchema);
