/**
 * Listing Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { listingValidation, idParamValidation } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, listingController.getAll);
router.get('/:id', optionalAuth, idParamValidation, listingController.getById);

// Protected routes (farmers only)
router.post(
  '/',
  auth,
  authorize('farmer', 'admin'),
  upload.array('images', 5),
  handleUploadError,
  listingValidation,
  listingController.create
);

router.put(
  '/:id',
  auth,
  authorize('farmer', 'admin'),
  upload.array('images', 5),
  handleUploadError,
  idParamValidation,
  listingController.update
);

router.delete(
  '/:id',
  auth,
  authorize('farmer', 'admin'),
  idParamValidation,
  listingController.delete
);

router.delete(
  '/:id/images/:imageIndex',
  auth,
  authorize('farmer', 'admin'),
  listingController.deleteImage
);

// Farmer-specific routes
router.get('/farmer/my-listings', auth, authorize('farmer', 'admin'), listingController.getMyListings);
router.get('/farmer/stats', auth, authorize('farmer', 'admin'), listingController.getStats);

module.exports = router;
