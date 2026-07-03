const mongoose = require('mongoose');

/**
 * Location Schema
 * Stores location tags for cafes in Damak
 */
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Location name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    cafesCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'locations',
  }
);

/**
 * Create indexes
 */
locationSchema.index({ name: 1 });
locationSchema.index({ order: 1 });

module.exports = mongoose.model('Location', locationSchema);
