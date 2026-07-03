require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import middleware
const { apiLimiter } = require('./middleware/rateLimit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const cafeRoutes = require('./routes/cafeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const offerRoutes = require('./routes/offerRoutes');
const tagRoutes = require('./routes/tagRoutes');
const locationRoutes = require('./routes/locationRoutes');
const userRoutes = require('./routes/userRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');

const app = express();

/**
 * ========================================
 * DATABASE CONNECTION
 * ========================================
 */
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-house')
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  });

/**
 * ========================================
 * SECURITY MIDDLEWARE
 * ========================================
 */

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * ========================================
 * LOGGING MIDDLEWARE
 * ========================================
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * ========================================
 * BODY PARSING MIDDLEWARE
 * ========================================
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * ========================================
 * STATIC FILES
 * ========================================
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * ========================================
 * API RATE LIMITING
 * ========================================
 */
app.use('/api/', apiLimiter);

/**
 * ========================================
 * HEALTH CHECK ENDPOINT
 * ========================================
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * ========================================
 * API ROUTES
 * ========================================
 */

// Auth routes
app.use('/api/auth', authRoutes);

// Cafe routes
app.use('/api/cafes', cafeRoutes);

// Review routes
app.use('/api/reviews', reviewRoutes);

// Offer routes
app.use('/api/offers', offerRoutes);

// Tag routes
app.use('/api/tags', tagRoutes);

// Location routes
app.use('/api/locations', locationRoutes);

// User routes
app.use('/api/users', userRoutes);

// PromoCode routes
app.use('/api/promo-codes', promoCodeRoutes);

/**
 * ========================================
 * API DOCUMENTATION
 * ========================================
 */
app.get('/api', (req, res) => {
  res.json({
    message: 'Cafe House API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cafes: '/api/cafes',
      reviews: '/api/reviews',
      offers: '/api/offers',
      tags: '/api/tags',
      locations: '/api/locations',
      users: '/api/users',
      promoCodes: '/api/promo-codes',
    },
    documentation: {
      auth: {
        'POST /api/auth/user/signup': 'User registration',
        'POST /api/auth/user/login': 'User login',
        'POST /api/auth/admin/login': 'Admin login',
        'GET /api/auth/verify': 'Verify token',
      },
      cafes: {
        'GET /api/cafes': 'Get all cafes with filters',
        'GET /api/cafes/featured': 'Get featured cafes',
        'GET /api/cafes/top-rated': 'Get top rated cafes',
        'GET /api/cafes/newest': 'Get newest cafes',
        'GET /api/cafes/:id': 'Get cafe details',
        'POST /api/cafes': 'Create cafe (Admin)',
        'PUT /api/cafes/:id': 'Update cafe (Admin)',
        'DELETE /api/cafes/:id': 'Delete cafe (Admin)',
      },
      reviews: {
        'GET /api/reviews/cafe/:cafeId': 'Get cafe reviews',
        'POST /api/reviews': 'Create review (User)',
        'PUT /api/reviews/:id': 'Update review (User)',
        'DELETE /api/reviews/:id': 'Delete review (User)',
        'POST /api/reviews/:id/helpful': 'Mark review as helpful (User)',
      },
      offers: {
        'GET /api/offers': 'Get all offers',
        'GET /api/offers/featured': 'Get featured offers',
        'GET /api/offers/:id': 'Get offer details',
        'POST /api/offers': 'Create offer (Admin)',
        'PUT /api/offers/:id': 'Update offer (Admin)',
        'DELETE /api/offers/:id': 'Delete offer (Admin)',
      },
      tags: {
        'GET /api/tags': 'Get all tags',
        'GET /api/tags/:id': 'Get tag details',
        'POST /api/tags': 'Create tag (Admin)',
        'PUT /api/tags/:id': 'Update tag (Admin)',
        'DELETE /api/tags/:id': 'Delete tag (Admin)',
      },
      locations: {
        'GET /api/locations': 'Get all locations',
        'GET /api/locations/:id': 'Get location details',
        'POST /api/locations': 'Create location (Admin)',
        'PUT /api/locations/:id': 'Update location (Admin)',
        'DELETE /api/locations/:id': 'Delete location (Admin)',
      },
      users: {
        'GET /api/users/profile': 'Get user profile (User)',
        'PUT /api/users/profile': 'Update user profile (User)',
        'POST /api/users/saved-cafes': 'Save cafe (User)',
        'DELETE /api/users/saved-cafes/:cafeId': 'Remove saved cafe (User)',
        'GET /api/users/saved-cafes': 'Get saved cafes (User)',
      },
      promoCodes: {
        'GET /api/promo-codes': 'Get all promo codes (Admin)',
        'GET /api/promo-codes/:code': 'Get promo code details',
        'POST /api/promo-codes': 'Create promo code (Admin)',
        'PUT /api/promo-codes/:id': 'Update promo code (Admin)',
        'DELETE /api/promo-codes/:id': 'Delete promo code (Admin)',
      },
    },
  });
});

/**
 * ========================================
 * ERROR HANDLING MIDDLEWARE
 * ========================================
 */

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

/**
 * ========================================
 * SERVER STARTUP
 * ========================================
 */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
${'='.repeat(50)}`);
  console.log('🚀 Cafe House API Server Started');
  console.log(`${'='.repeat(50)}`);
  console.log(`✓ Server running on: http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API Documentation: http://localhost:${PORT}/api`);
  console.log(`✓ Health Check: http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(50)}\n`);
});

/**
 * ========================================
 * GRACEFUL SHUTDOWN
 * ========================================
 */
process.on('SIGTERM', () => {
  console.log('\n✓ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✓ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✓ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\n✓ SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✓ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✓ MongoDB connection closed');
      process.exit(0);
    });
  });
});

/**
 * ========================================
 * UNHANDLED ERRORS
 * ========================================
 */
process.on('unhandledRejection', err => {
  console.error('✗ Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.error('✗ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
