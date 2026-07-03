const mongoose = require('mongoose');

/**
 * Tag Schema
 * Stores cafe tags for categorization
 */
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    icon: String,
    color: {
      type: String,
      match: /^#[0-9A-F]{6}$/i,
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
    collection: 'tags',
  }
);

module.exports = mongoose.model('Tag', tagSchema);
