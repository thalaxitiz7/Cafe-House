const mongoose = require('mongoose');

/**
 * Review Schema
 * Stores user reviews and ratings for cafes
 */
const reviewSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: [true, 'Cafe ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    text: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review text cannot exceed 1000 characters'],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
    collection: 'reviews',
  }
);

/**
 * Create indexes for efficient querying
 */
reviewSchema.index({ cafeId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: -1 });

/**
 * Pre-save hook to validate unique review per user per cafe
 */
reviewSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingReview = await mongoose.model('Review').findOne({
      cafeId: this.cafeId,
      userId: this.userId,
    });
    
    if (existingReview) {
      throw new Error('User has already reviewed this cafe');
    }
  }
  next();
});

/**
 * Post-save hook to update cafe rating
 */
reviewSchema.post('save', async function () {
  const Cafe = mongoose.model('Cafe');
  const cafe = await Cafe.findById(this.cafeId);
  
  if (cafe) {
    await cafe.calculateAverageRating();
  }
});

/**
 * Post-delete hook to update cafe rating
 */
reviewSchema.post('deleteOne', async function () {
  const Cafe = mongoose.model('Cafe');
  const cafe = await Cafe.findById(this.cafeId);
  
  if (cafe) {
    await cafe.calculateAverageRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
