const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Stores regular user information and authentication data
 */
const userSchema = new mongoose.Schema(
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
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      url: String,
      publicId: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
    },
    savedCafes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
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
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Get full name of user
 * @method getFullName
 * @returns {String}
 */
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName || ''}`.trim();
};

/**
 * Update last login
 * @method updateLastLogin
 * @returns {Promise<void>}
 */
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

/**
 * Check if cafe is saved
 * @method hasSavedCafe
 * @param {String} cafeId - Cafe ID
 * @returns {Boolean}
 */
userSchema.methods.hasSavedCafe = function (cafeId) {
  return this.savedCafes.some(id => id.toString() === cafeId.toString());
};

module.exports = mongoose.model('User', userSchema);
