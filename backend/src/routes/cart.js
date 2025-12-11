/**
 * Cart Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth, authorize } = require('../middleware/auth');

// All cart routes require authentication and buyer/admin role
router.use(auth);
router.use(authorize('buyer', 'admin'));

// Cart operations
router.post('/add', cartController.addItem);
router.get('/', cartController.getCart);
router.get('/count', cartController.getCount);
router.get('/validate', cartController.validateCart);
router.put('/:id', cartController.updateItem);
router.delete('/:id', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
