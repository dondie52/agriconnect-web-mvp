# 🌿 AgriConnect Botswana

**Connecting Farmers to Markets Across Botswana**

AgriConnect is a full-stack web application that empowers smallholder farmers in Botswana by connecting them directly to buyers, providing real-time market information, weather updates, and tools for crop planning.

## 🎯 Project Overview

AgriConnect addresses three major obstacles faced by Botswana's farmers:
- **Poor Market Access**: Enables farmers to reach buyers nationwide
- **Lack of Real-Time Information**: Provides market prices, weather alerts, and farming guides
- **Isolated Farmer Community**: Offers crop planning tools to avoid oversupply

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (Supabase hosted)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local uploads (switchable to S3)
- **API Style**: RESTful

### Frontend
- **Framework**: React 18
- **Styling**: TailwindCSS
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Charts**: Recharts

### External APIs
- OpenWeather API for weather data

## 📁 Project Structure

```
agriconnect/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, upload
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Migration & seed scripts
│   │   └── server.js        # Entry point
│   ├── uploads/             # Image uploads
│   ├── database/            # SQL schema
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Global styles
│   │   └── App.jsx          # Main app
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**

   **Option A: Using Supabase (Recommended)**
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   OPENWEATHER_API_KEY=your_api_key
   FRONTEND_URL=http://localhost:3000
   ```

   **Option B: Using Local PostgreSQL**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=agriconnect
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   OPENWEATHER_API_KEY=your_api_key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Test database connection**
   ```bash
   node test-db.js
   ```

6. **Run migrations** (if using local PostgreSQL, create database first: `createdb agriconnect`)
   ```bash
   npm run migrate
   ```

7. **Seed database with sample data**
   ```bash
   npm run seed
   ```

8. **Start the server**
   ```bash
   npm run dev
   ```

9. **Verify database connection via API**
   ```bash
   curl http://localhost:5000/api/test-db
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
   ```

5. **Start development server**
   ```bash
   npm start
   ```

## 🔐 Demo Credentials

After running the seed script, you can use these credentials:

| Role   | Phone        | Password   |
|--------|--------------|------------|
| Admin  | 26712345678  | admin123   |
| Farmer | 26776543210  | farmer123  |
| Buyer  | 26774567890  | buyer123   |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (farmers)
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Orders
- `POST /api/orders` - Place order (buyers)
- `GET /api/orders/farmer/my-orders` - Get farmer's orders
- `GET /api/orders/buyer/my-orders` - Get buyer's orders
- `PUT /api/orders/:id/status` - Update order status

### Prices
- `GET /api/prices` - Get market prices
- `POST /api/prices` - Update price (admin)

### Requests
- `GET /api/requests` - Get buyer requests
- `POST /api/requests` - Create request (buyers)
- `GET /api/requests/farmer/relevant` - Get relevant requests for farmer

### Weather
- `GET /api/weather/my-region` - Get weather for user's region
- `GET /api/weather/forecast/:region_id` - Get forecast

### Crop Plans
- `POST /api/crop-plans` - Create/update crop plan
- `GET /api/crop-plans/my-plans` - Get farmer's plans
- `GET /api/crop-plans/trends/region/:id` - Get regional trends

### Analytics
- `GET /api/analytics/farmer/overview` - Get farmer analytics
- `GET /api/analytics/farmer/top-listings` - Get top listings

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/toggle-status` - Suspend/activate user

## 🏗 Features by Sprint

### Sprint 1 (Core System)
- ✅ User registration & login
- ✅ JWT authentication
- ✅ Listings CRUD
- ✅ Basic UI pages

### Sprint 2 (Market Info)
- ✅ Market prices module
- ✅ Listing filters
- ✅ Notifications system
- ✅ Admin price controls

### Sprint 3 (Communication)
- ✅ Buyer requests
- ✅ Farmer request view
- ✅ Contact modal

### Sprint 4 (Enhancements)
- ✅ Image uploads
- ✅ Weather widget
- ✅ Crop planner
- ✅ Analytics dashboard

## 🎨 UI Design

The UI follows a clean, farmer-friendly design:
- **Primary Color**: #2E7D32 (Agriculture Green)
- **Secondary Color**: #F9A825 (Sunlight Yellow)
- **Typography**: Poppins (headings), Roboto (body)
- **Mobile-responsive** layouts

## 🚢 Deployment

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres` |
| `PORT` | Server port | `10000` |
| `NODE_ENV` | Environment mode | `production` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.vercel.app` |
| `OPENWEATHER_API_KEY` | OpenWeather API key | `your-api-key` |

### Local Development with Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your DATABASE_URL**:
   - Go to Supabase Dashboard → Settings → Database
   - Copy the "URI" connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Set up your `.env` file**:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

4. **Test the connection**:
   ```bash
   cd backend
   node test-db.js
   ```

5. **Run migrations on Supabase**:
   ```bash
   npm run migrate
   ```

### Deploy Backend to Render

1. **Create account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `backend` directory as root
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Configure Environment Variables** in Render Dashboard:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-domain.com
   OPENWEATHER_API_KEY=your-api-key
   ```

4. **Deploy** - Render will automatically build and deploy

5. **Verify deployment**:
   ```bash
   curl https://your-backend.onrender.com/api/test-db
   ```

### Deploy Frontend to Vercel

1. **Create account** at [vercel.com](https://vercel.com)

2. **Import your repository** and select the `frontend` directory

3. **Configure Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   REACT_APP_UPLOAD_URL=https://your-backend.onrender.com/uploads
   ```

4. **Deploy** - Vercel will automatically build and deploy

### Deploy to Railway

1. Create a Railway account at [railway.app](https://railway.app)
2. Create new project and add PostgreSQL
3. Deploy backend:
   ```bash
   cd backend
   railway link
   railway up
   ```
4. Deploy frontend to Vercel/Netlify

### Deploy Frontend to GitHub Pages

GitHub Pages provides free static hosting for your frontend application.

#### Prerequisites

- Your backend must be deployed separately (e.g., on Render, Railway, or Heroku)
- You need a GitHub repository for the frontend code

#### Environment Variables on GitHub Pages

GitHub Pages serves static files only, so environment variables must be set **at build time**. There are two approaches:

**Option A: Local Build and Deploy (Recommended for simplicity)**

1. Create/edit `frontend/.env.production` with your production values:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Build and deploy locally (variables are baked into the build)

**Option B: GitHub Actions (Recommended for CI/CD)**

1. Go to your GitHub repository Settings > Secrets and variables > Actions
2. Add these repository secrets:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
3. Create a GitHub Actions workflow to build with these secrets

#### Step-by-Step Deployment

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies** (includes gh-pages)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `.env.production` with your actual production values:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Build the production bundle**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

   This pushes the `dist` folder to the `gh-pages` branch.

6. **Enable GitHub Pages** (first time only)
   - Go to repository Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select `gh-pages` branch and `/ (root)` folder
   - Save

7. **Access your site** at:
   ```
   https://your-username.github.io/agriconnect-web-frontend/
   ```

#### Redeploying After Changes

After making code changes, redeploy with:

```bash
cd frontend
npm run build
npm run deploy
```

Or as a single command:
```bash
cd frontend && npm run build && npm run deploy
```

#### Quick Reference: Terminal Commands

```bash
# Full deployment from scratch
cd frontend
npm install
# Edit .env.production with your values
npm run build
npm run deploy

# Redeploy after changes
cd frontend
npm run build
npm run deploy
```

#### Important Notes

- **SPA Routing**: GitHub Pages doesn't support client-side routing by default. If you have routing issues, you may need to use hash-based routing or add a 404.html redirect
- **Base Path**: The app is configured with base path `/agriconnect-web-frontend/` in vite.config.js
- **CORS**: Ensure your backend allows requests from `https://your-username.github.io`
- **Environment Variables**: Never commit real API keys to the repository. Use `.env.production` locally or GitHub Secrets for CI/CD

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 API Documentation

Full OpenAPI documentation is available at `/api/docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Botswana Innovation Hub
- Ministry of Agriculture, Botswana
- All smallholder farmers who inspired this project

---

**AgriConnect Botswana** - Empowering farmers, connecting markets, building food security. 🌾
