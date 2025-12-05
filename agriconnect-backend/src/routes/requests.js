/**
 * Buyer Request Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const buyerRequestController = require('../controllers/buyerRequestController');
const { auth, authorize } = require('../middleware/auth');
const { requestValidation, idParamValidation } = require('../middleware/validation');

// Public/authenticated routes for viewing requests
router.get('/', auth, buyerRequestController.getAll);
router.get('/:id', auth, idParamValidation, buyerRequestController.getById);

// Buyer routes
router.post('/', auth, authorize('buyer', 'admin'), requestValidation, buyerRequestController.create);
router.get('/buyer/my-requests', auth, authorize('buyer', 'admin'), buyerRequestController.getMyRequests);
router.put('/:id', auth, authorize('buyer', 'admin'), idParamValidation, buyerRequestController.update);
router.delete('/:id', auth, authorize('buyer', 'admin'), idParamValidation, buyerRequestController.delete);
router.post('/:id/close', auth, authorize('buyer', 'admin'), idParamValidation, buyerRequestController.close);

// Farmer routes
router.get('/farmer/relevant', auth, authorize('farmer', 'admin'), buyerRequestController.getRelevantForFarmer);

module.exports = router;
