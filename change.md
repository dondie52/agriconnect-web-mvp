# Live Market Prices - Implementation Summary

## Overview
Implemented real-time market prices feature for AgriConnect Botswana that pulls and stores crop prices for key regions (Gaborone, Francistown, Maun, Central, Southern) and displays them in the UI.

## New Files Created

### Backend Services (`backend/src/services/`)
- **marketPriceSyncService.js** - FAO API integration with fallback to market fluctuations when API unavailable
- **priceCache.js** - In-memory cache with 10-minute TTL for price queries
- **scheduler.js** - Cron job running every 3 hours (Africa/Gaborone timezone)

### Backend Utilities (`backend/src/utils/`)
- **logger.js** - Logging utility for sync operations
- **seedPrices.js** - Script to seed initial Botswana market prices

## Modified Files

### Backend
- **routes/prices.js** - Added `/latest`, `/sync-status`, `/sync` endpoints
- **controllers/priceController.js** - Added caching integration and sync handlers
- **server.js** - Integrated scheduler startup and graceful shutdown
- **package.json** - Added `node-cron` dependency

### Frontend
- **pages/MarketPricesPage.jsx** - Full UI with live data, auto-refresh (60s), filters
- **hooks/useApi.js** - Added `useLatestPrices`, `usePriceSyncStatus` hooks
- **api/index.js** - Added price API endpoints

## Database
- Uses existing `prices` table with columns: `crop_id`, `region_id`, `price`, `previous_price`, `unit`, `updated_at`
- Uses existing `v_market_prices` view

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/prices/latest` | GET | Public | Get latest prices (cached, supports crop/region filters) |
| `/api/prices/sync-status` | GET | Public | Get sync status and cache stats |
| `/api/prices/sync` | POST | Admin | Manually trigger price sync |

## Features
- Auto-sync every 3 hours from FAO FPMA API
- Graceful fallback to market fluctuations when API unavailable
- In-memory caching with 10-minute TTL
- Price change alerts (notifications when price changes >10%)
- Frontend auto-refresh every 60 seconds
- Filter by crop and region
- Visual indicators for price changes (green up, red down)

## Testing
```bash
# Seed initial prices
cd backend && npm run seed:prices

# Start backend
npm run dev

# Test API
curl http://localhost:5000/api/prices/latest
curl http://localhost:5000/api/prices/sync-status
```

## Environment Variables
```env
# Backend (.env)
DATABASE_URL=<your-supabase-url>  # or use individual DB_* vars
FAO_API_URL=https://fpma.apps.fao.org/giews/food-prices/api/v1  # optional

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
```

---

# Production Live Server Upgrade

**Author:** Claude (Cursor AI Assistant)  
**Date:** December 6, 2025

## Overview
Upgraded AgriConnect backend for production deployment on Railway/Vercel/DigitalOcean with WebSocket streaming, enhanced caching, and health monitoring. Updated frontend with 15-second polling and optional WebSocket real-time price updates.

## New Files Created

### Frontend Hooks (`frontend/src/hooks/`)
- **useRealtimePrices.js** - Real-time prices hook combining 15s polling with WebSocket streaming, auto-reconnect with exponential backoff, graceful fallback when WebSocket unavailable

## Modified Files

### Backend

| File | Changes |
|------|---------|
| `package.json` | Added `ws` package (v8.18.3) for WebSocket support |
| `src/server.js` | Added HTTP server wrapper, WebSocket server at `/live/prices`, root-level `/health` endpoint, `broadcastPriceUpdate()` function, graceful WebSocket shutdown |
| `src/services/priceCache.js` | Changed cache TTL from 10 minutes to 15 minutes |
| `src/services/marketPriceSyncService.js` | Added WebSocket broadcast callback after price sync completes |

### Frontend

| File | Changes |
|------|---------|
| `src/api/index.js` | Added `API_BASE_URL` and `WS_URL` exports for WebSocket connections |
| `src/hooks/useApi.js` | Changed `useLatestPrices` refetchInterval from 60s to 15s, staleTime from 30s to 10s |
| `src/pages/MarketPricesPage.jsx` | Integrated `useRealtimePrices` hook, added WebSocket status indicators (STREAMING/RECONNECTING badges), updated countdown display, added error display card |

## New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Root-level health check (required by deployment platforms) |
| `/live/prices` | WebSocket | Real-time price streaming via WebSocket |

## Features Added
- **WebSocket Streaming**: Real-time price updates pushed to connected clients instantly
- **Root Health Check**: `/health` endpoint returns `{status: "ok"}` for deployment platforms
- **15-Second Polling**: Frontend polls every 15 seconds (reduced from 60s)
- **15-Minute Cache TTL**: Extended fallback cache duration from 10 to 15 minutes
- **Auto-Reconnect**: WebSocket reconnects with exponential backoff (max 5 attempts)
- **Connection Status UI**: Shows LIVE, STREAMING, or RECONNECTING status badges
- **Error Display**: Shows connection errors in the UI

## Deployment Instructions

### Railway Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment (`.env.production`)
```env
REACT_APP_API_URL=https://your-backend.up.railway.app/api
REACT_APP_UPLOAD_URL=https://your-backend.up.railway.app/uploads
```

## Testing

```bash
# Test root health check
curl https://your-backend.up.railway.app/health
# Expected: {"status":"ok","timestamp":"...","service":"agriconnect-api"}

# Test API health check with DB status
curl https://your-backend.up.railway.app/api/health
# Expected: {"status":"ok","db":"connected","uptime":"...","timestamp":"..."}

# Test WebSocket connection
wscat -c wss://your-backend.up.railway.app/live/prices
# Expected: {"type":"connected","message":"Connected to AgriConnect live prices",...}
```

## Technical Details

### WebSocket Protocol
- **Connection**: `ws://localhost:5000/live/prices` (dev) or `wss://your-domain/live/prices` (prod)
- **Messages**:
  - `{type: "connected", message: "...", timestamp: "..."}` - Initial handshake
  - `{type: "price_update", data: {prices: [...], syncStats: {...}}, timestamp: "..."}` - Price updates

### Frontend Hook Usage
```javascript
import { useRealtimePrices } from '../hooks/useRealtimePrices';

const { 
  prices,           // Array of price objects
  isLoading,        // Initial loading state
  isFetching,       // Refetching state
  error,            // Error message if any
  lastSync,         // ISO timestamp of last sync
  isCached,         // Whether data is from cache
  wsState,          // WebSocket connection state
  isWebSocketConnected,  // Boolean shorthand
  countdown,        // Seconds until next poll
  refetch           // Manual refresh function
} = useRealtimePrices(filters, {
  enableWebSocket: true,
  pollingInterval: 15000
});
```
