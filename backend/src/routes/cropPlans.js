/**
 * Crop Plan Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const cropPlanController = require('../controllers/cropPlanController');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { cropPlanValidation, idParamValidation } = require('../middleware/validation');

// Public routes
router.get('/trends/national', optionalAuth, cropPlanController.getNationalTrends);
router.get('/trends/region/:region_id', optionalAuth, cropPlanController.getRegionalTrends);

// Farmer routes
router.post('/', auth, authorize('farmer', 'admin'), cropPlanValidation, cropPlanController.upsert);
router.get('/my-plans', auth, authorize('farmer', 'admin'), cropPlanController.getMyPlans);
router.get('/summary', auth, authorize('farmer', 'admin'), cropPlanController.getSummary);
router.delete('/:id', auth, authorize('farmer', 'admin'), idParamValidation, cropPlanController.delete);

module.exports = router;
