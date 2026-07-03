const mongoose = require('mongoose');

/**
 * Review Schema
 * Stores user reviews for cafes
 */
const reviewSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    text: {
      type: String,
      maxlength: 5000,
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
 * Ensure one review per user per cafe
 */
reviewSchema.index({ cafeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
