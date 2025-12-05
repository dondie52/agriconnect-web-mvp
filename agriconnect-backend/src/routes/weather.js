/**
 * Weather Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { auth, optionalAuth } = require('../middleware/auth');

// Get weather for user's region (requires auth)
router.get('/my-region', auth, weatherController.getForUser);

// Get weather by region ID (public)
router.get('/region/:region_id', optionalAuth, weatherController.getByRegion);

// Get forecast
router.get('/forecast', auth, weatherController.getForecast);
router.get('/forecast/:region_id', optionalAuth, weatherController.getForecast);

// Get alerts
router.get('/alerts', auth, weatherController.getAlerts);
router.get('/alerts/:region_id', optionalAuth, weatherController.getAlerts);

module.exports = router;
