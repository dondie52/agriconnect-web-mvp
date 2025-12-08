# AgriConnect - File Structure

## Project Overview

```
agriconnect-web-mvp/
├── backend/                    # Express.js API server
├── frontend/                   # React + Vite frontend
├── scripts/                    # Utility scripts
├── change.md                   # Change log
├── DEPLOYMENT.md               # Deployment guide
├── README.md                   # Project readme
├── LICENSE
└── railway.json                # Railway deployment config
```

---

## Backend Structure

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
    ├── server.js                # Main entry point (Express + WebSocket)
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
    │   ├── priceCache.js             # In-memory price cache (15min TTL)
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

---

## Frontend Structure (Vite + React)

```
frontend/
├── package.json                 # Dependencies & Vite scripts
├── package-lock.json
├── vite.config.js               # Vite configuration (aliases, port 3000)
├── index.html                   # Entry HTML (Vite root)
├── postcss.config.cjs           # PostCSS config (Tailwind)
├── tailwind.config.cjs          # Tailwind CSS configuration
├── README_ENV.md                # Environment setup guide
│
├── public/                      # Static assets (served as-is)
│   ├── favicon.svg
│   └── founder.jpg
│
└── src/
    ├── main.jsx                 # App entry point (React 18 createRoot)
    ├── App.jsx                  # Root component with routing
    │
    ├── api/
    │   └── index.js             # Axios instance & API endpoints
    │
    ├── config/
    │   └── api.js               # API URL configuration (VITE_* env vars)
    │
    ├── lib/
    │   └── supabase.js          # Supabase client (realtime subscriptions)
    │
    ├── context/
    │   └── AuthContext.jsx      # Authentication context provider
    │
    ├── hooks/
    │   ├── useApi.js            # React Query hooks for API calls
    │   ├── useAiTips.js         # AI farming tips hook
    │   ├── useRealtime.js       # Supabase realtime hook
    │   ├── useRealtimePrices.js # WebSocket + polling price hook
    │   └── useWeather.js        # Weather data hook
    │
    ├── components/
    │   ├── Layout.jsx           # Main layout wrapper
    │   ├── ProtectedRoute.jsx   # Auth route guard
    │   ├── UI.jsx               # Reusable UI components
    │   ├── WeatherCard.jsx      # Weather display card
    │   ├── chatbot/
    │   │   ├── Chatbot.jsx      # Main chatbot component
    │   │   ├── ChatbotButton.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── chatbot.css
    │   │   └── index.js
    │   └── weather/
    │       └── AiTipsCard.jsx   # AI weather tips card
    │
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ProfilePage.jsx
    │   ├── FarmerDashboard.jsx
    │   ├── AdminDashboard.jsx
    │   ├── ListingsPage.jsx
    │   ├── ListingDetailPage.jsx
    │   ├── CreateListingPage.jsx
    │   ├── EditListingPage.jsx
    │   ├── MyListingsPage.jsx
    │   ├── MyOrdersPage.jsx
    │   ├── BuyerRequestsPage.jsx
    │   ├── CreateRequestPage.jsx
    │   ├── MyRequestsPage.jsx
    │   ├── MarketPricesPage.jsx
    │   ├── WeatherPage.jsx
    │   ├── CropPlannerPage.jsx
    │   ├── AnalyticsPage.jsx
    │   ├── NotificationsPage.jsx
    │   ├── auth/
    │   │   └── RoleSelectPage.jsx
    │   ├── landing/
    │   │   ├── LandingPage.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductGrid.jsx
    │   │   ├── FeaturedCarousel.jsx
    │   │   ├── CategoriesSection.jsx
    │   │   ├── QuickActions.jsx
    │   │   ├── CTABanner.jsx
    │   │   ├── Testimonials.jsx
    │   │   └── index.js
    │   └── info/
    │       ├── AboutPage.jsx
    │       ├── MissionPage.jsx
    │       ├── HowItWorksPage.jsx
    │       ├── FAQPage.jsx
    │       ├── HelpCenterPage.jsx
    │       ├── TermsPage.jsx
    │       ├── PrivacyPage.jsx
    │       ├── CookiesPage.jsx
    │       ├── SafetyPage.jsx
    │       ├── SellerGuidePage.jsx
    │       ├── USSDGuidePage.jsx
    │       ├── CommunityPage.jsx
    │       ├── SuccessStoriesPage.jsx
    │       ├── CareersPage.jsx
    │       ├── PressPage.jsx
    │       └── index.js
    │
    ├── services/
    │   └── weatherService.js    # Weather API service
    │
    ├── styles/
    │   └── index.css            # Global styles + Tailwind
    │
    └── test/
        └── checkApi.js          # API connection test utility
```

---

## NPM Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (hot reload)
npm run seed       # Run general seed script
npm run seed:prices # Seed market prices
npm run migrate    # Run database migrations
npm test           # Run tests
```

### Frontend (Vite)
```bash
npm run dev        # Start Vite dev server (port 3000)
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

---

## Environment Variables

### Backend (.env)
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

### Frontend (.env)
```env
# Required
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_UPLOAD_URL=http://localhost:5000/uploads
```

---

## Key Features by File

### Market Prices (Live Sync + WebSocket)
```
Backend:
  src/routes/prices.js              → API endpoints
  src/controllers/priceController.js → Business logic
  src/models/Price.js               → Database queries
  src/services/marketPriceSyncService.js → FAO API sync
  src/services/priceCache.js        → Caching layer (15min TTL)
  src/services/scheduler.js         → Cron job (every 3 hours)
  src/server.js                     → WebSocket /live/prices

Frontend:
  src/pages/MarketPricesPage.jsx    → UI with filters
  src/hooks/useRealtimePrices.js    → WebSocket + polling hook
  src/hooks/useApi.js               → useLatestPrices query
```

### Authentication
```
Backend:
  src/routes/auth.js
  src/controllers/authController.js
  src/models/User.js
  src/middleware/auth.js

Frontend:
  src/context/AuthContext.jsx
  src/pages/LoginPage.jsx
  src/pages/RegisterPage.jsx
  src/components/ProtectedRoute.jsx
```

### Listings
```
Backend:
  src/routes/listings.js
  src/controllers/listingController.js
  src/models/Listing.js
  src/middleware/upload.js

Frontend:
  src/pages/ListingsPage.jsx
  src/pages/ListingDetailPage.jsx
  src/pages/CreateListingPage.jsx
  src/pages/MyListingsPage.jsx
```

### AI/Chatbot
```
Backend:
  src/routes/chatRoutes.js
  src/routes/aiRoutes.js
  src/controllers/chatController.js
  src/controllers/aiController.js
  src/ai/*.js

Frontend:
  src/components/chatbot/*
  src/hooks/useAiTips.js
```
