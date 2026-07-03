const mongoose = require('mongoose');

/**
 * Location Schema
 * Stores geographic location data for cafes
 */
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
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
    radius: {
      type: Number,
      default: 5000, // meters
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'locations',
  }
);

/**
 * Geospatial index
 */
locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
