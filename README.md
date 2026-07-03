# CafeHub Damak - Production Ready Cafe Discovery Platform

## Overview

CafeHub Damak is a comprehensive cafe discovery platform for Damak, Nepal. It combines features from Google Maps, TripAdvisor, Yelp, and Foodmandu but is dedicated exclusively to cafes.

## Features

### User Features
- 🔍 **Smart Search** - Search by cafe name, location, tags, and budget
- 🏷️ **Advanced Filters** - Filter by parking, family-friendly, WiFi, outdoor seating, and more
- ⭐ **Rating System** - Rate cafes on a 5-star scale with reviews
- 💾 **Saved Cafes** - Bookmark favorite cafes for quick access
- 🎉 **Offers & Promos** - View active offers with countdown timers and promo codes
- 📍 **Location Tags** - Discover cafes by specific locations in Damak
- 🖼️ **Image Gallery** - Browse cafe galleries with responsive masonry layout
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile

### Admin Features
- 📊 **Dashboard** - Statistics and overview of all cafes
- ➕ **Cafe Management** - Create, edit, and delete cafes
- 🏷️ **Tag Management** - Create and manage cafe tags
- 📍 **Location Management** - Manage location tags
- 🎁 **Offer Management** - Create and manage offers and promo codes
- ⭐ **Review Management** - View and delete reviews
- 🖼️ **Image Management** - Upload and manage cafe images
- 👥 **User Management** - View and manage users

## Tech Stack

### Frontend
- HTML5
- CSS3 (Custom, no Bootstrap)
- Vanilla JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB

### Authentication
- JWT (JSON Web Tokens)
- bcrypt (Password Encryption)

### Additional Tools
- Multer (Image Upload)
- Helmet (Security)
- Rate Limiter (API Protection)
- Google Maps Embed

## Project Structure

```
Cafe-House/
├── frontend/
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── cafes.html
│   │   ├── tags.html
│   │   ├── locations.html
│   │   ├── offers.html
│   │   ├── reviews.html
│   │   ├── users.html
│   │   ├── settings.html
│   │   └── js/
│   ├── pages/
│   │   ├── home.html
│   │   ├── explore.html
│   │   ├── cafe-detail.html
│   │   ├── offers.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── profile.html
│   │   ├── saved-cafes.html
│   │   └── 404.html
│   ├── css/
│   │   ├── variables.css
│   │   ├── global.css
│   │   ├── navbar.css
│   │   └── pages/
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── utils.js
│   │   └── components/
│   └── assets/
│
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cafeController.js
│   │   ├── reviewController.js
│   │   ├── offerController.js
│   │   ├── tagController.js
│   │   ├── locationController.js
│   │   ├── userController.js
│   │   └── imageController.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Cafe.js
│   │   ├── Review.js
│   │   ├── Offer.js
│   │   ├── Tag.js
│   │   ├── Location.js
│   │   └── PromoCode.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cafes.js
│   │   ├── reviews.js
│   │   ├── offers.js
│   │   ├── tags.js
│   │   ├── locations.js
│   │   ├── users.js
│   │   ├── images.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── sanitizers.js
│   │   ├── errorMessages.js
│   │   └── helpers.js
│   ├── public/
│   │   └── uploads/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── package.json
```

## Color Theme

- **Primary**: #2E6F40 (Forest Green)
- **Secondary**: #D4AF37 (Gold)
- **Background**: #F8F6F2 (Cream)
- **Dark**: #222222 (Nearly Black)
- **Text**: #555555 (Dark Gray)
- **White Cards**: #FFFFFF
- **Accent**: #FF8A00 (Orange)

## Typography

- **Body**: Poppins
- **Headings**: Playfair Display

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Frontend Setup

```bash
# Frontend files are static and can be served directly
# For development, use a local server:
python -m http.server 8000
# or
npx http-server
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Cafes
- `GET /api/cafes` - Get all cafes (with search/filter)
- `GET /api/cafes/:id` - Get cafe details
- `POST /api/cafes` - Create cafe (admin only)
- `PUT /api/cafes/:id` - Update cafe (admin only)
- `DELETE /api/cafes/:id` - Delete cafe (admin only)

### Reviews
- `GET /api/reviews/:cafeId` - Get cafe reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review (admin only)

### Offers
- `GET /api/offers` - Get all offers
- `GET /api/offers/:id` - Get offer details
- `POST /api/offers` - Create offer (admin only)
- `PUT /api/offers/:id` - Update offer (admin only)
- `DELETE /api/offers/:id` - Delete offer (admin only)

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag (admin only)
- `DELETE /api/tags/:id` - Delete tag (admin only)

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create location (admin only)
- `DELETE /api/locations/:id` - Delete location (admin only)

### Images
- `POST /api/images/upload` - Upload image
- `DELETE /api/images/:id` - Delete image (admin only)

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafehub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Security Features

- JWT-based authentication
- bcrypt password hashing
- Helmet for HTTP header security
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- SQL/NoSQL injection prevention

## Performance Features

- Lazy loading for images
- Loading skeletons
- Shimmer effects
- Intersection Observer API
- Responsive images
- CSS custom properties for theming
- Smooth animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Author

CafeHub Team

## Support

For support, please create an issue in the repository.
