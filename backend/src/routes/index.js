/**
 * Routes Index for AgriConnect
 * Combines all route modules
 */
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const listingRoutes = require('./listings');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const priceRoutes = require('./prices');
const requestRoutes = require('./requests');
const notificationRoutes = require('./notifications');
const weatherRoutes = require('./weather');
const cropPlanRoutes = require('./cropPlans');
const analyticsRoutes = require('./analytics');
const adminRoutes = require('./admin');
const aiRoutes = require('./aiRoutes');
const chatRoutes = require('./chatRoutes');

// Import controllers
const dashboardController = require('../controllers/dashboardController');

// Import middleware
const { auth } = require('../middleware/auth');

// Import database pool for test routes
const { pool } = require('../config/db');

// Server start time for uptime calculation
const serverStartTime = Date.now();

// API health check (deployment platforms require this format)
router.get('/health', async (req, res) => {
  const uptimeSeconds = ((Date.now() - serverStartTime) / 1000).toFixed(2);
  
  // Check database connection
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    console.error('Health check DB error:', error.message);
  }
  
  res.json({
    status: 'ok',
    db: dbStatus,
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString()
  });
});

// Database connection test route
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      time: result.rows[0],
      message: 'Supabase connection successful'
    });
  } catch (error) {
    console.error('Database test failed:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/prices', priceRoutes);
router.use('/requests', requestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/weather', weatherRoutes);
router.use('/crop-plans', cropPlanRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/chat', chatRoutes);

// Dashboard stats endpoint (optimized for real-time updates)
router.get('/dashboard/stats', auth, dashboardController.getStats);

// Reference data endpoints (public)
const { Crop, Region } = require('../models/CropRegion');

router.get('/crops', async (req, res) => {
  try {
    const crops = await Crop.findAll();
    res.json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crops' });
  }
});

router.get('/regions', async (req, res) => {
  try {
    const regions = await Region.findAll();
    res.json({ success: true, data: regions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch regions' });
  }
});

module.exports = router;
