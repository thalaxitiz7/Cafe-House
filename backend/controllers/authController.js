const Admin = require('../models/Admin');
const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { sanitizeEmail } = require('../utils/sanitizers');
const CONSTANTS = require('../config/constants');

/**
 * Auth Controller
 * Handles user and admin authentication
 */

/**
 * User Signup
 * @async
 * @function userSignup
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const userSignup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizeEmail(email) });
    if (existingUser) {
      return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_USER_EXISTS,
      });
    }

    // Create new user
    const user = await User.create({
      email: sanitizeEmail(email),
      password,
      firstName,
      lastName: lastName || '',
    });

    // Generate token
    const token = generateToken(user._id, false);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(CONSTANTS.STATUS_CODES.CREATED).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_SIGNUP,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * @async
 * @function userLogin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and select password
    const user = await User.findOne({ email: sanitizeEmail(email) }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_INVALID_CREDENTIALS,
      });
    }

    if (!user.isActive) {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    // Generate token
    const token = generateToken(user._id, false);

    // Update last login
    await user.updateLastLogin();

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_LOGIN,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Login
 * @async
 * @function adminLogin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin and select password
    const admin = await Admin.findOne({ email: sanitizeEmail(email) }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_INVALID_CREDENTIALS,
      });
    }

    if (!admin.isActive) {
      return res.status(CONSTANTS.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Admin account is deactivated',
      });
    }

    // Generate token with admin flag
    const token = generateToken(admin._id, true);

    // Update last login
    await admin.updateLastLogin();

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: CONSTANTS.MESSAGES.SUCCESS_LOGIN,
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Token
 * @async
 * @function verifyToken
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const verifyToken = async (req, res, next) => {
  try {
    const userId = req.userId;
    const isAdmin = req.userRole === 'admin';

    if (isAdmin) {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
        });
      }

      return res.status(CONSTANTS.STATUS_CODES.OK).json({
        success: true,
        message: 'Token verified',
        data: {
          user: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            isAdmin: true,
          },
        },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: CONSTANTS.MESSAGES.ERROR_NOT_FOUND,
      });
    }

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      success: true,
      message: 'Token verified',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: false,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userSignup,
  userLogin,
  adminLogin,
  verifyToken,
};
