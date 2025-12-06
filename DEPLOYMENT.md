# AgriConnect Deployment Guide

## Overview

This guide covers deploying AgriConnect as a live production system:
- **Backend**: Railway (Node.js + PostgreSQL + WebSockets)
- **Frontend**: Vercel or Netlify (React/Create React App)

---

## Backend Deployment (Railway)

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Set the root directory to `backend`

### 2. Add PostgreSQL Database

1. Click "New" → "Database" → "PostgreSQL"
2. Railway automatically sets `DATABASE_URL` environment variable

### 3. Configure Environment Variables

In Railway dashboard, add these variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Auto-set by Railway PostgreSQL | Yes (auto) |
| `PORT` | Auto-set by Railway | Yes (auto) |
| `NODE_ENV` | `production` | Yes |
| `JWT_SECRET` | Your secure 32+ char secret | Yes |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Recommended |
| `OPENAI_API_KEY` | Your OpenAI API key | Optional |
| `OPENWEATHER_API_KEY` | Your OpenWeather API key | Optional |

### 4. Deploy

Railway auto-deploys on push. Check logs for:
```
✅ Database connection successful
✅ Scheduler started (market prices sync every 3 hours)
🚀 Server running on port XXXX
```

---

## Frontend Deployment (Vercel)

### 1. Import Project

1. Go to [vercel.com](https://vercel.com) and import from GitHub
2. Set root directory to `frontend`
3. Framework preset: **Create React App**

### 2. Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://your-backend.up.railway.app/api` |
| `REACT_APP_UPLOAD_URL` | `https://your-backend.up.railway.app/uploads` |

### 3. Deploy

Vercel auto-deploys on push. Your frontend will be live at `https://your-app.vercel.app`.

---

## Frontend Deployment (Netlify Alternative)

### 1. Import Project

1. Go to [netlify.com](https://netlify.com) and import from GitHub
2. Set base directory to `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/build`

### 2. Configure Environment Variables

Same as Vercel - add in Netlify dashboard.

---

## Validation Tests

After deployment, run these tests to verify everything works:

### 1. Health Check (Root Level)

```bash
curl https://your-backend.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T10:00:00.000Z",
  "service": "agriconnect-api"
}
```

### 2. API Health Check (With Database)

```bash
curl https://your-backend.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "db": "connected",
  "uptime": "...",
  "timestamp": "..."
}
```

### 3. Latest Prices Endpoint

```bash
curl https://your-backend.up.railway.app/api/prices/latest
```

**Expected Response:**
```json
{
  "success": true,
  "data": [...],
  "cached": false,
  "lastSync": "2025-12-06T10:00:00.000Z"
}
```

### 4. WebSocket Connection Test

Using wscat (install with `npm install -g wscat`):

```bash
wscat -c wss://your-backend.up.railway.app/live/prices
```

**Expected Response:**
```json
{"type":"connected","message":"Connected to AgriConnect live prices","timestamp":"..."}
```

When prices sync, you'll receive:
```json
{"type":"price_update","data":{"prices":[...],"syncStats":{...}},"timestamp":"..."}
```

---

## Frontend UI Indicators

The Market Prices page shows connection status:

| Badge | Meaning |
|-------|---------|
| 🟢 **LIVE** | System is live and polling |
| ⚡ **STREAMING** | WebSocket connected, real-time updates |
| 🔄 **RECONNECTING** | WebSocket reconnecting (with countdown) |
| 📴 **OFFLINE** | User is offline, data cached |

---

## Troubleshooting

### Backend Issues

**Database connection failed:**
- Check `DATABASE_URL` is correct
- Ensure SSL is enabled (`?sslmode=require`)
- Check Railway PostgreSQL is running

**CORS errors:**
- Set `FRONTEND_URL` to your Vercel/Netlify URL
- Can use comma-separated values: `https://app1.vercel.app,https://app2.netlify.app`

**WebSocket not connecting:**
- Railway supports WebSockets by default
- Check browser console for connection errors
- Verify `wss://` protocol (not `ws://`) in production

### Frontend Issues

**API requests failing:**
- Verify `REACT_APP_API_URL` includes `/api` suffix
- Check backend is running (test `/health` endpoint)
- Check browser Network tab for actual errors

**Images not loading:**
- Verify `REACT_APP_UPLOAD_URL` is set correctly
- Ensure uploads folder exists on backend

---

## Architecture Summary

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │
│   (Vercel)      │     │   (Railway)     │
│                 │     │                 │
│  React App      │     │  Express.js     │
│  + React Query  │     │  + WebSocket    │
│                 │     │  + Cron Jobs    │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   PostgreSQL    │
                        │   (Railway)     │
                        └─────────────────┘
```

### Data Flow

1. **Polling**: Frontend polls `/api/prices/latest` every 15 seconds
2. **WebSocket**: Real-time push via `wss://backend/live/prices`
3. **Sync**: Backend syncs prices every 3 hours from FAO API
4. **Broadcast**: After sync, backend broadcasts to all WebSocket clients
5. **Offline**: Frontend detects offline status and pauses requests

---

## Production Checklist

- [ ] Backend deployed on Railway
- [ ] PostgreSQL database connected
- [ ] `JWT_SECRET` set (secure, 32+ chars)
- [ ] `FRONTEND_URL` set for CORS
- [ ] Frontend deployed on Vercel/Netlify
- [ ] `REACT_APP_API_URL` configured
- [ ] `REACT_APP_UPLOAD_URL` configured
- [ ] `/health` returns `{"status":"ok"}`
- [ ] `/api/prices/latest` returns data
- [ ] WebSocket connects at `/live/prices`
- [ ] Market Prices page shows LIVE/STREAMING badge
- [ ] Price updates appear in real-time
