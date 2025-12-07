# AgriConnect Backend - File Structure

```
backend/
├── package.json                 # Dependencies & scripts
├── package-lock.json
├── test-db.js                   # Database connection test utility
│
├── database/
│   └── schema.sql               # PostgreSQL schema (tables, views, seed data)
│
├── uploads/                     # User uploaded files (images)
│
└── src/
    ├── server.js                # Main entry point (Express app)
    │
    ├── config/
    │   └── db.js                # PostgreSQL connection pool & query helper
    │
    ├── routes/
    │   ├── index.js             # Route aggregator (mounts all routes)
    │   ├── auth.js              # /api/auth - Login, register, profile
    │   ├── listings.js          # /api/listings - Farmer produce listings
    │   ├── orders.js            # /api/orders - Buyer orders
    │   ├── prices.js            # /api/prices - Market prices (live sync)
    │   ├── requests.js          # /api/requests - Buyer requests
    │   ├── notifications.js     # /api/notifications - User notifications
    │   ├── weather.js           # /api/weather - Weather data
    │   ├── cropPlans.js         # /api/crop-plans - Crop planning
    │   ├── analytics.js         # /api/analytics - Farmer analytics
    │   ├── admin.js             # /api/admin - Admin dashboard
    │   ├── aiRoutes.js          # /api/ai - AI farming tips
    │   └── chatRoutes.js        # /api/chat - Chatbot
    │
    ├── controllers/
    │   ├── authController.js         # Auth logic (register, login, profile)
    │   ├── listingController.js      # Listing CRUD operations
    │   ├── orderController.js        # Order management
    │   ├── priceController.js        # Market price queries & sync
    │   ├── buyerRequestController.js # Buyer request handling
    │   ├── notificationController.js # Notification management
    │   ├── weatherController.js      # Weather data retrieval
    │   ├── cropPlanController.js     # Crop planning logic
    │   ├── analyticsController.js    # Analytics & reporting
    │   ├── dashboardController.js    # Dashboard stats
    │   ├── adminController.js        # Admin operations
    │   ├── aiController.js           # AI-powered tips
    │   └── chatController.js         # Chatbot responses
    │
    ├── models/
    │   ├── User.js              # User model (farmers, buyers, admins)
    │   ├── Listing.js           # Produce listing model
    │   ├── Order.js             # Order model
    │   ├── Price.js             # Market price model
    │   ├── BuyerRequest.js      # Buyer request model
    │   ├── Notification.js      # Notification model
    │   ├── CropPlan.js          # Crop planning model
    │   ├── CropRegion.js        # Crops & Regions reference data
    │   └── Analytics.js         # Analytics events model
    │
    ├── services/
    │   ├── marketPriceSyncService.js # FAO API sync + price updates
    │   ├── priceCache.js             # In-memory price cache (10min TTL)
    │   ├── scheduler.js              # Cron scheduler (3-hour sync)
    │   └── weatherService.js         # Weather API integration
    │
    ├── middleware/
    │   ├── auth.js              # JWT authentication & role authorization
    │   ├── upload.js            # Multer file upload configuration
    │   └── validation.js        # Request validation rules
    │
    ├── ai/
    │   ├── cropAdvisor.js       # Crop recommendation engine
    │   ├── intents.js           # Chatbot intent definitions
    │   ├── llmHelper.js         # OpenAI API helper
    │   ├── responseGenerator.js # Chatbot response generation
    │   ├── systemPrompt.js      # AI system prompts
    │   └── weatherTips.js       # Weather-based farming tips
    │
    └── utils/
        ├── logger.js            # Logging utility (file + console)
        ├── migrate.js           # Database migration runner
        ├── seed.js              # General seed data script
        └── seedPrices.js        # Market price seeding script
```

## Key Files by Feature

### Market Prices (Live Sync)
```
src/routes/prices.js              → API endpoints
src/controllers/priceController.js → Business logic
src/models/Price.js               → Database queries
src/services/marketPriceSyncService.js → FAO API sync
src/services/priceCache.js        → Caching layer
src/services/scheduler.js         → Cron job (every 3 hours)
```

### Authentication
```
src/routes/auth.js
src/controllers/authController.js
src/models/User.js
src/middleware/auth.js
```

### Listings
```
src/routes/listings.js
src/controllers/listingController.js
src/models/Listing.js
src/middleware/upload.js
```

### Orders
```
src/routes/orders.js
src/controllers/orderController.js
src/models/Order.js
```

### AI/Chatbot
```
src/routes/chatRoutes.js
src/routes/aiRoutes.js
src/controllers/chatController.js
src/controllers/aiController.js
src/ai/*.js
```

## NPM Scripts

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (hot reload)
npm run seed       # Run general seed script
npm run seed:prices # Seed market prices
npm run migrate    # Run database migrations
npm test           # Run tests
```

## Environment Variables

```env
# Database (Supabase or local)
DATABASE_URL=postgresql://...    # Full connection string
# OR individual vars:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agriconnect
DB_USER=postgres
DB_PASS=password

# Server
PORT=5000
NODE_ENV=development

# Auth
JWT_SECRET=your-secret-key

# External APIs
FAO_API_URL=https://fpma.apps.fao.org/giews/food-prices/api/v1
OPENAI_API_KEY=sk-...
WEATHER_API_KEY=...

# Frontend
FRONTEND_URL=http://localhost:3000
```







