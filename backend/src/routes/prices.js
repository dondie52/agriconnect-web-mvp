/**
 * Price Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const { auth, authorize } = require('../middleware/auth');
const { priceValidation } = require('../middleware/validation');

// Public routes
router.get('/latest', priceController.getLatest);
router.get('/sync-status', priceController.getSyncStatus);
router.get('/', priceController.getAll);
router.get('/crop/:crop_id', priceController.getByCrop);
router.get('/region/:region_id', priceController.getByRegion);
router.get('/crop/:crop_id/region/:region_id', priceController.getByCropAndRegion);

// Admin routes
router.post('/sync', auth, authorize('admin'), priceController.triggerSync);
router.post('/', auth, authorize('admin'), priceValidation, priceController.upsert);
router.put('/', auth, authorize('admin'), priceValidation, priceController.upsert);
router.post('/bulk', auth, authorize('admin'), priceController.bulkUpsert);
router.delete('/crop/:crop_id/region/:region_id', auth, authorize('admin'), priceController.delete);

module.exports = router;
