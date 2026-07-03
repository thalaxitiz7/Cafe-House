const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema
 * Stores admin user information and authentication data
 */
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin', 'moderator'],
      default: 'admin',
    },
    permissions: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    collection: 'admins',
  }
);

/**
 * Hash password before saving
 */
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password with hashed password
 * @method matchPassword
 * @param {String} enteredPassword - Password to compare
 * @returns {Promise<Boolean>}
 */
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Update last login
 * @method updateLastLogin
 * @returns {Promise<void>}
 */
adminSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

module.exports = mongoose.model('Admin', adminSchema);
