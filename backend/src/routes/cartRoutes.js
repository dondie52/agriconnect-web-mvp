const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// Require authentication for all cart actions
router.use(auth);

// Add item to cart (upsert by user + listing)
router.post('/add', cartController.addItem);

// Get all cart items for the authenticated user
router.get('/', cartController.getCart);

// Remove a specific cart item
router.delete('/:id', cartController.removeItem);

module.exports = router;
