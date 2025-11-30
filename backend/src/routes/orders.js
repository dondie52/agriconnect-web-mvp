/**
 * Order Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');
const { orderValidation, idParamValidation } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Buyer routes
router.post('/', authorize('buyer', 'admin'), orderValidation, orderController.create);
router.get('/buyer/my-orders', authorize('buyer', 'admin'), orderController.getBuyerOrders);
router.post('/:id/cancel', authorize('buyer'), idParamValidation, orderController.cancel);

// Farmer routes
router.get('/farmer/my-orders', authorize('farmer', 'admin'), orderController.getFarmerOrders);
router.get('/farmer/stats', authorize('farmer', 'admin'), orderController.getStats);
router.put('/:id/status', authorize('farmer', 'admin'), idParamValidation, orderController.updateStatus);

// Common routes
router.get('/:id', idParamValidation, orderController.getById);

module.exports = router;
