/**
 * Order Controller for AgriConnect
 * Handles order operations between buyers and farmers
 */
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Analytics = require('../models/Analytics');
const Listing = require('../models/Listing');

const orderController = {
  // Create a new order (buyer)
  async create(req, res) {
    try {
      const { listing_id, quantity, delivery_preference, notes } = req.body;

      // Get listing to get crop name for notification
      const listing = await Listing.findById(listing_id);
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }

      const order = await Order.create({
        listing_id,
        buyer_id: req.user.id,
        quantity,
        delivery_preference,
        notes
      });

      // Track the order event
      await Analytics.trackOrder(listing_id, req.user.id);

      // Notify the farmer
      await Notification.notifyFarmerNewOrder(
        listing.farmer_id,
        order.id,
        req.user.name,
        listing.crop_name,
        quantity
      );

      // Get full order details
      const fullOrder = await Order.findById(order.id);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: fullOrder
      });
    } catch (error) {
      console.error('Create order error:', error);
      
      if (error.message === 'Listing not available') {
        return res.status(400).json({
          success: false,
          message: 'This listing is no longer available'
        });
      }
      
      if (error.message === 'Requested quantity exceeds available stock') {
        return res.status(400).json({
          success: false,
          message: 'Requested quantity exceeds available stock'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to place order'
      });
    }
  },

  // Get order by ID
  async getById(req, res) {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check authorization (buyer, farmer, or admin)
      if (
        order.buyer_id !== req.user.id &&
        order.farmer_id !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order'
      });
    }
  },

  // Update order status (farmer accepts/rejects)
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const allowedStatuses = ['accepted', 'rejected', 'completed'];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Allowed: accepted, rejected, completed'
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Only farmer can update status
      if (order.farmer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order'
        });
      }

      const updatedOrder = await Order.updateStatus(req.params.id, status, req.user.id);

      // Notify the buyer
      await Notification.notifyBuyerOrderStatus(
        order.buyer_id,
        order.id,
        status,
        order.crop_name
      );

      res.json({
        success: true,
        message: `Order ${status} successfully`,
        data: updatedOrder
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }
  },

  // Get farmer's orders
  async getFarmerOrders(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const result = await Order.findByFarmer(req.user.id, {
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get farmer orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  },

  // Get buyer's orders
  async getBuyerOrders(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const result = await Order.findByBuyer(req.user.id, {
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get buyer orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  },

  // Get order statistics for farmer
  async getStats(req, res) {
    try {
      const stats = await Order.getStats(req.user.id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  },

  // Cancel order (buyer only, if pending)
  async cancel(req, res) {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Only buyer can cancel
      if (order.buyer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this order'
        });
      }

      // Can only cancel pending orders
      if (order.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Can only cancel pending orders'
        });
      }

      // Use farmer_id as a placeholder since buyer is cancelling
      await Order.updateStatus(req.params.id, 'cancelled', order.farmer_id);

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel order'
      });
    }
  }
};

module.exports = orderController;
