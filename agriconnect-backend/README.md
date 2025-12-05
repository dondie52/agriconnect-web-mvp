# AgriConnect Backend

Backend API for AgriConnect - Connecting Botswana farmers to markets.

## 🚀 Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## 🚂 Deploy to Railway

### Option 1: Deploy via GitHub

1. Push this folder to a GitHub repository
2. Go to [railway.app](https://railway.app)
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Node.js and runs `npm start`

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Environment Variables on Railway

Add these in Railway Dashboard → Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (from Supabase or Railway Postgres) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `OPENWEATHER_API_KEY` | OpenWeather API key |
| `OPENAI_API_KEY` | OpenAI API key for chatbot |

---

## 📁 Project Structure

```
agriconnect-backend/
├── src/
│   ├── server.js          # Entry point
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   ├── models/            # Database models
│   ├── middleware/        # Auth, validation, uploads
│   ├── ai/                # AI chatbot logic
│   ├── services/          # External services
│   └── utils/             # Helpers & migrations
├── package.json
├── .env.example
└── README.md
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | API status |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/listings` | Get all listings |
| POST | `/api/listings` | Create listing |
| GET | `/api/weather` | Get weather data |
| POST | `/api/ai/chat` | AI chatbot |

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT
- **AI:** OpenAI GPT

---

## 📝 License

MIT
