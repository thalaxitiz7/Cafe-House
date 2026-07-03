const mongoose = require('mongoose');

/**
 * Tag Schema
 * Stores cafe tags for categorization and filtering
 */
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Tag name cannot exceed 50 characters'],
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#2E6F40',
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color'],
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
    collection: 'tags',
  }
);

/**
 * Create indexes
 */
tagSchema.index({ name: 1 });
tagSchema.index({ order: 1 });

module.exports = mongoose.model('Tag', tagSchema);
