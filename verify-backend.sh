#!/bin/bash

# Backend Startup Verification Script
# This script checks if all required files and dependencies are present

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   Backend Verification Script              ║"
echo "║   Checking project structure...            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Check function
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1 (MISSING)"
    ((FAILED++))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1/ (MISSING)"
    ((FAILED++))
  fi
}

echo "Checking directories..."
check_dir "backend/config"
check_dir "backend/controllers"
check_dir "backend/middleware"
check_dir "backend/models"
check_dir "backend/routes"
check_dir "backend/utils"

echo ""
echo "Checking configuration files..."
check_file "backend/server.js"
check_file "backend/package.json"
check_file "backend/.env.example"

echo ""
echo "Checking controllers..."
check_file "backend/controllers/authController.js"
check_file "backend/controllers/cafeController.js"
check_file "backend/controllers/reviewController.js"
check_file "backend/controllers/offerController.js"
check_file "backend/controllers/tagController.js"
check_file "backend/controllers/locationController.js"
check_file "backend/controllers/userController.js"
check_file "backend/controllers/promoCodeController.js"

echo ""
echo "Checking models..."
check_file "backend/models/User.js"
check_file "backend/models/Admin.js"
check_file "backend/models/Cafe.js"
check_file "backend/models/Review.js"
check_file "backend/models/Offer.js"
check_file "backend/models/Tag.js"
check_file "backend/models/Location.js"
check_file "backend/models/PromoCode.js"

echo ""
echo "Checking routes..."
check_file "backend/routes/authRoutes.js"
check_file "backend/routes/cafeRoutes.js"
check_file "backend/routes/reviewRoutes.js"
check_file "backend/routes/offerRoutes.js"
check_file "backend/routes/tagRoutes.js"
check_file "backend/routes/locationRoutes.js"
check_file "backend/routes/userRoutes.js"
check_file "backend/routes/promoCodeRoutes.js"

echo ""
echo "Checking middleware..."
check_file "backend/middleware/auth.js"
check_file "backend/middleware/validation.js"
check_file "backend/middleware/errorHandler.js"
check_file "backend/middleware/rateLimit.js"

echo ""
echo "Checking utilities..."
check_file "backend/utils/validators.js"
check_file "backend/utils/sanitizers.js"
check_file "backend/utils/errorMessages.js"
check_file "backend/utils/helpers.js"

echo ""
echo "Checking configuration..."
check_file "backend/config/constants.js"
check_file "backend/config/database.js"

echo ""
echo "════════════════════════════════════════════"
echo -e "${GREEN}Passed: $PASSED${NC}  |  ${RED}Failed: $FAILED${NC}"
echo "════════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. cd backend"
  echo "  2. npm install"
  echo "  3. cp .env.example .env"
  echo "  4. Update .env with your configuration"
  echo "  5. npm run dev"
  echo ""
  exit 0
else
  echo ""
  echo -e "${RED}✗ Some checks failed!${NC}"
  echo "Please verify the missing files."
  echo ""
  exit 1
fi
