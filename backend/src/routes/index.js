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
const priceRoutes = require('./prices');
const requestRoutes = require('./requests');
const notificationRoutes = require('./notifications');
const weatherRoutes = require('./weather');
const cropPlanRoutes = require('./cropPlans');
const analyticsRoutes = require('./analytics');
const adminRoutes = require('./admin');

// API health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AgriConnect API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/orders', orderRoutes);
router.use('/prices', priceRoutes);
router.use('/requests', requestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/weather', weatherRoutes);
router.use('/crop-plans', cropPlanRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

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
