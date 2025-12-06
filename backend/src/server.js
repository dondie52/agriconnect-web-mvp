/**
 * AgriConnect Botswana - Main Server
 * A marketplace platform connecting farmers to buyers
 * Production-ready with WebSocket support for real-time price updates
 */
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const routes = require('./routes');

// Initialize Express app
const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost on any port
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // In production, use configured frontend URL
    // If FRONTEND_URL is not set, allow all origins (useful for initial deployment)
    const allowedOrigins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',')
      : null; // null = allow all origins if not configured
    
    if (!allowedOrigins || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root-level health check (required by Railway/Vercel/DigitalOcean)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AgriConnect Botswana API',
    version: '1.0.0',
    description: 'Connecting farmers to markets across Botswana',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      success: false,
      message: 'Referenced record not found'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;

// Create HTTP server (required for WebSocket)
const server = http.createServer(app);

// WebSocket server for live price updates
const wss = new WebSocket.Server({ server, path: '/live/prices' });

// Track connected clients
const wsClients = new Set();

wss.on('connection', (ws, req) => {
  console.log('📡 WebSocket client connected for live prices');
  wsClients.add(ws);
  
  // Send initial connection confirmation
  ws.send(JSON.stringify({ 
    type: 'connected', 
    message: 'Connected to AgriConnect live prices',
    timestamp: new Date().toISOString()
  }));
  
  ws.on('close', () => {
    console.log('📡 WebSocket client disconnected');
    wsClients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
    wsClients.delete(ws);
  });
});

// Broadcast function for price updates (exported for use by sync service)
const broadcastPriceUpdate = (data) => {
  const message = JSON.stringify({
    type: 'price_update',
    data,
    timestamp: new Date().toISOString()
  });
  
  wsClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  
  console.log(`📡 Broadcasted price update to ${wsClients.size} clients`);
};

// Export broadcast function for use by other modules
module.exports.broadcastPriceUpdate = broadcastPriceUpdate;

const startServer = async () => {
  // Test database connection
  const { testConnection } = require('./config/db');
  try {
    await testConnection();
    console.log('✅ Database connection successful');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }

  // Start the scheduler for periodic tasks
  const scheduler = require('./services/scheduler');
  scheduler.start();
  console.log('✅ Scheduler started (market prices sync every 3 hours)');

  server.listen(PORT, () => {
    console.log(`
🌿 AgriConnect Botswana API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server running on port ${PORT}
📡 Environment: ${process.env.NODE_ENV || 'development'}
🌐 API Base URL: http://localhost:${PORT}/api
📁 Uploads: http://localhost:${PORT}/uploads
🔌 WebSocket: ws://localhost:${PORT}/live/prices
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
};

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  const scheduler = require('./services/scheduler');
  scheduler.stop();
  
  // Close WebSocket connections
  wss.clients.forEach((client) => {
    client.close(1001, 'Server shutting down');
  });
  wss.close();
  server.close();
  
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  const scheduler = require('./services/scheduler');
  scheduler.stop();
  
  // Close WebSocket connections
  wss.clients.forEach((client) => {
    client.close(1001, 'Server shutting down');
  });
  wss.close();
  server.close();
  
  process.exit(0);
});

module.exports = app;
