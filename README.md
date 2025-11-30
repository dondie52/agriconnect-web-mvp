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
- **Database**: PostgreSQL
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
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=agriconnect
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   
   OPENWEATHER_API_KEY=your_api_key
   
   FRONTEND_URL=http://localhost:3000
   ```

5. **Create database**
   ```bash
   createdb agriconnect
   ```

6. **Run migrations**
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

### Deploy to Render

1. Create account at [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service for backend
4. Create Static Site for frontend

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
