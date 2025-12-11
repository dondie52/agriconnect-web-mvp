/**
 * Cart Controller for AgriConnect
 * Handles shopping cart API operations
 */
const Cart = require('../models/Cart');

const cartController = {
  /**
   * Add item to cart
   * POST /api/cart/add
   */
  async addItem(req, res) {
    try {
      const { listing_id, quantity } = req.body;

      if (!listing_id || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Listing ID and quantity are required'
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }

      const cartItem = await Cart.addItem({
        user_id: req.user.id,
        listing_id: parseInt(listing_id),
        quantity: parseFloat(quantity)
      });

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: cartItem
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      
      if (error.message.includes('not found') || 
          error.message.includes('not available') ||
          error.message.includes('Cannot add your own')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Only') && error.message.includes('available')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to add item to cart'
      });
    }
  },

  /**
   * Get user's cart
   * GET /api/cart
   */
  async getCart(req, res) {
    try {
      const cart = await Cart.getByUser(req.user.id);

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart'
      });
    }
  },

  /**
   * Update cart item quantity
   * PUT /api/cart/:id
   */
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid quantity is required'
        });
      }

      const cartItem = await Cart.updateQuantity({
        id: parseInt(id),
        user_id: req.user.id,
        quantity: parseFloat(quantity)
      });

      res.json({
        success: true,
        message: 'Cart updated',
        data: cartItem
      });
    } catch (error) {
      console.error('Update cart error:', error);
      
      if (error.message === 'Cart item not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('no longer available') ||
          error.message.includes('Only') && error.message.includes('available')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update cart'
      });
    }
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/:id
   */
  async removeItem(req, res) {
    try {
      const { id } = req.params;

      await Cart.removeItem({
        id: parseInt(id),
        user_id: req.user.id
      });

      res.json({
        success: true,
        message: 'Item removed from cart'
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      
      if (error.message === 'Cart item not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart'
      });
    }
  },

  /**
   * Clear entire cart
   * DELETE /api/cart
   */
  async clearCart(req, res) {
    try {
      await Cart.clearCart(req.user.id);

      res.json({
        success: true,
        message: 'Cart cleared'
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear cart'
      });
    }
  },

  /**
   * Get cart item count
   * GET /api/cart/count
   */
  async getCount(req, res) {
    try {
      const count = await Cart.getItemCount(req.user.id);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Get cart count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get cart count'
      });
    }
  },

  /**
   * Validate cart before checkout
   * GET /api/cart/validate
   */
  async validateCart(req, res) {
    try {
      const validation = await Cart.validateCart(req.user.id);

      res.json({
        success: true,
        data: validation
      });
    } catch (error) {
      console.error('Validate cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate cart'
      });
    }
  }
};

module.exports = cartController;
