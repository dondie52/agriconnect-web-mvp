/**
 * Livestock Routes for AgriConnect
 * Handles livestock tracking endpoints for farmers
 */
const express = require('express');
const router = express.Router();
const livestockController = require('../controllers/livestockController');
const { auth, authorize } = require('../middleware/auth');

// All livestock routes require authentication and farmer/admin role
router.use(auth);
router.use(authorize('farmer', 'admin'));

// Livestock CRUD operations
router.post('/', livestockController.create);
router.get('/', livestockController.getAll);
router.get('/summary', livestockController.getSummary);
router.get('/:id', livestockController.getById);
router.put('/:id', livestockController.update);
router.delete('/:id', livestockController.delete);

// Livestock events
router.post('/:id/events', livestockController.addEvent);
router.get('/:id/events', livestockController.getEvents);

module.exports = router;
