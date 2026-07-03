const jwt = require('jsonwebtoken');

/**
 * Helper Functions
 * Utility functions for common operations
 */

/**
 * Generate JWT token
 * @function generateToken
 * @param {String} id - User or Admin ID
 * @param {Boolean} isAdmin - Is admin token
 * @returns {String} - JWT token
 */
const generateToken = (id, isAdmin = false) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Get pagination params
 * @function getPaginationParams
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} - { skip: Number, limit: Number }
 */
const getPaginationParams = (page = 1, limit = 12) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

/**
 * Format response object
 * @function formatResponse
 * @param {Boolean} success - Success status
 * @param {String} message - Response message
 * @param {*} data - Response data
 * @returns {Object}
 */
const formatResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

/**
 * Get café ranking stars
 * @function getCafeStars
 * @param {Number} points - Ranking points
 * @returns {Number} - Star count (1-5)
 */
const getCafeStars = (points) => {
  if (points >= 980) return 5;
  if (points >= 900) return 4;
  if (points >= 800) return 3;
  if (points >= 700) return 2;
  return 1;
};

/**
 * Get star symbols
 * @function getStarSymbol
 * @param {Number} stars - Number of stars
 * @returns {String} - Star symbols
 */
const getStarSymbol = (stars) => {
  const fullStar = '★';
  const emptyStar = '☆';
  const filled = fullStar.repeat(stars);
  const empty = emptyStar.repeat(5 - stars);
  return filled + empty;
};

/**
 * Check if offer is active
 * @function isOfferActive
 * @param {Date} validFrom - Offer start date
 * @param {Date} validUntil - Offer end date
 * @param {Boolean} isActive - Is active flag
 * @returns {Boolean}
 */
const isOfferActive = (validFrom, validUntil, isActive = true) => {
  const now = new Date();
  return isActive && now >= new Date(validFrom) && now <= new Date(validUntil);
};

/**
 * Get days until date
 * @function getDaysUntil
 * @param {Date} date - Target date
 * @returns {Number} - Days remaining
 */
const getDaysUntil = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Generate search query
 * @function generateSearchQuery
 * @param {String} searchTerm - Search term
 * @returns {Object} - MongoDB search query
 */
const generateSearchQuery = (searchTerm) => {
  if (!searchTerm) return {};
  
  return {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { 'location.address': { $regex: searchTerm, $options: 'i' } },
    ],
  };
};

/**
 * Build filter query
 * @function buildFilterQuery
 * @param {Object} filters - Filter object
 * @returns {Object} - MongoDB filter query
 */
const buildFilterQuery = (filters) => {
  const query = { isActive: true };

  if (filters.location) {
    query['location.locationTag'] = filters.location;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.parking === 'true') {
    query['facilities.parking'] = true;
  }

  if (filters.wifi === 'true') {
    query['facilities.wifi'] = true;
  }

  if (filters.outdoor === 'true') {
    query['facilities.outdoor'] = true;
  }

  if (filters.petFriendly === 'true') {
    query['facilities.petFriendly'] = true;
  }

  if (filters.airConditioned === 'true') {
    query['facilities.airConditioned'] = true;
  }

  return query;
};

/**
 * Build sort query
 * @function buildSortQuery
 * @param {String} sortBy - Sort field
 * @param {String} order - Sort order (asc/desc)
 * @returns {Object} - MongoDB sort query
 */
const buildSortQuery = (sortBy = 'createdAt', order = 'desc') => {
  const validFields = ['rating', 'createdAt', 'name', 'ranking'];
  const field = validFields.includes(sortBy) ? sortBy : 'createdAt';
  const direction = order === 'asc' ? 1 : -1;

  if (field === 'rating') {
    return { 'rating.average': direction };
  }
  if (field === 'ranking') {
    return { 'ranking.points': direction };
  }

  return { [field]: direction };
};

/**
 * Get cafe filter options
 * @function getCafeFilterOptions
 * @returns {Object}
 */
const getCafeFilterOptions = () => {
  return {
    facilities: [
      { key: 'parking', label: 'Parking Available' },
      { key: 'wifi', label: 'WiFi Available' },
      { key: 'outdoor', label: 'Outdoor Seating' },
      { key: 'indoor', label: 'Indoor Seating' },
      { key: 'petFriendly', label: 'Pet Friendly' },
      { key: 'airConditioned', label: 'Air Conditioned' },
      { key: 'smoking', label: 'Smoking Area' },
      { key: 'bikeParkingAvailable', label: 'Bike Parking' },
    ],
    paymentMethods: [
      { key: 'cash', label: 'Cash Payment' },
      { key: 'card', label: 'Card Payment' },
      { key: 'qrPayment', label: 'QR Payment' },
    ],
  };
};

module.exports = {
  generateToken,
  getPaginationParams,
  formatResponse,
  getCafeStars,
  getStarSymbol,
  isOfferActive,
  getDaysUntil,
  generateSearchQuery,
  buildFilterQuery,
  buildSortQuery,
  getCafeFilterOptions,
};
