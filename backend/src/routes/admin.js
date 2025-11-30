/**
 * Admin Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(auth, authorize('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.put('/users/:id/role', adminController.updateUserRole);

// Crop management
router.get('/crops', adminController.getCrops);
router.post('/crops', adminController.createCrop);
router.put('/crops/:id', adminController.updateCrop);

// Region management
router.get('/regions', adminController.getRegions);
router.post('/regions', adminController.createRegion);
router.put('/regions/:id', adminController.updateRegion);

// Listing monitoring
router.get('/listings', adminController.getListings);

module.exports = router;
