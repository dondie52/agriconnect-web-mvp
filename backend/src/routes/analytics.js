/**
 * Analytics Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

// Tracking routes (can be public or authenticated)
router.post('/track/view', optionalAuth, analyticsController.trackView);
router.post('/track/contact', auth, analyticsController.trackContact);

// Farmer analytics routes
router.get('/farmer/overview', auth, authorize('farmer', 'admin'), analyticsController.getFarmerSummary);
router.get('/farmer/details', auth, authorize('farmer', 'admin'), analyticsController.getFarmerAnalytics);
router.get('/farmer/top-listings', auth, authorize('farmer', 'admin'), analyticsController.getTopListings);
router.get('/listing/:listing_id/trends', auth, analyticsController.getListingTrends);

// Admin analytics routes
router.get('/platform/overview', auth, authorize('admin'), analyticsController.getPlatformOverview);
router.get('/platform/details', auth, authorize('admin'), analyticsController.getPlatformAnalytics);

module.exports = router;
