/**
 * Order Controller for AgriConnect
 * Handles order operations between buyers and farmers
 * Updated for cart-based checkout system with enhanced delivery features
 */
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const Analytics = require('../models/Analytics');
const Listing = require('../models/Listing');

const orderController = {
  /**
   * Create order from cart (checkout) with enhanced delivery options
   * POST /api/orders/create
   */
  async createFromCart(req, res) {
    try {
      const { 
        delivery_type,
        delivery_preference, // For backward compatibility
        address_text,
        delivery_address, // For backward compatibility
        latitude,
        longitude,
        phone_number,
        delivery_fee,
        total_amount,
        notes 
      } = req.body;

      // Determine final delivery type
      const finalDeliveryType = delivery_type || delivery_preference || 'pickup';

      // Validate delivery-specific fields
      if (finalDeliveryType === 'delivery') {
        const finalAddress = address_text || delivery_address;
        
        if (!finalAddress || !finalAddress.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Delivery address is required for delivery orders'
          });
        }

        if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
          return res.status(400).json({
            success: false,
            message: 'Location coordinates are required for delivery orders'
          });
        }

        // Validate coordinate ranges
        if (latitude < -90 || latitude > 90) {
          return res.status(400).json({
            success: false,
            message: 'Invalid latitude. Must be between -90 and 90'
          });
        }

        if (longitude < -180 || longitude > 180) {
          return res.status(400).json({
            success: false,
            message: 'Invalid longitude. Must be between -180 and 180'
          });
        }
      }

      // Validate phone number if provided
      if (phone_number && phone_number.trim()) {
        // Basic phone validation (allows various formats)
        const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
        if (!phoneRegex.test(phone_number.trim())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid phone number format'
          });
        }
      }

      // Validate delivery fee if provided
      if (delivery_fee !== undefined && delivery_fee !== null && delivery_fee < 0) {
        return res.status(400).json({
          success: false,
          message: 'Delivery fee cannot be negative'
        });
      }

      // Validate cart first
      const validation = await Cart.validateCart(req.user.id);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Some items in your cart are no longer available',
          data: { issues: validation.issues }
        });
      }

      // Get cart items for notifications
      const cart = await Cart.getByUser(req.user.id);
      if (cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty'
        });
      }

      // Create order from cart with enhanced delivery fields
      const order = await Order.createFromCart({
        buyer_id: req.user.id,
        delivery_type: finalDeliveryType,
        delivery_preference: finalDeliveryType, // For backward compatibility
        address_text: address_text || delivery_address,
        delivery_address: address_text || delivery_address, // For backward compatibility
        latitude: finalDeliveryType === 'delivery' ? latitude : null,
        longitude: finalDeliveryType === 'delivery' ? longitude : null,
        phone_number: phone_number || req.user.phone || null,
        delivery_fee: finalDeliveryType === 'delivery' ? (delivery_fee || 0) : 0,
        total_amount,
        notes
      });

      // Track analytics and send notifications for each item
      const farmerNotifications = new Map(); // Group by farmer

      for (const item of cart.items) {
        // Track order analytics
        try {
          await Analytics.trackOrder(item.listing_id, req.user.id);
        } catch (e) {
          console.error('Analytics tracking error:', e);
        }

        // Group items by farmer for notifications
        if (!farmerNotifications.has(item.farmer_id)) {
          farmerNotifications.set(item.farmer_id, {
            farmer_id: item.farmer_id,
            items: []
          });
        }
        farmerNotifications.get(item.farmer_id).items.push({
          crop_name: item.crop_name,
          quantity: item.quantity
        });
      }

      // Send notification to each farmer
      for (const [farmerId, data] of farmerNotifications) {
        const itemsDescription = data.items.map(i => `${i.quantity} ${i.crop_name}`).join(', ');
        try {
          await Notification.notifyFarmerNewOrder(
            farmerId,
            order.id,
            req.user.name,
            itemsDescription,
            data.items.reduce((sum, i) => sum + parseFloat(i.quantity), 0)
          );
        } catch (e) {
          console.error('Notification error:', e);
        }
      }

      // Get full order details
      const fullOrder = await Order.findById(order.id);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: fullOrder
      });
    } catch (error) {
      console.error('Checkout error:', error);
      
      if (error.message === 'Cart is empty') {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty'
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
        message: 'Failed to place order'
      });
    }
  },

  /**
   * Legacy: Create a single-item order (for backward compatibility)
   * POST /api/orders
   */
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
      const cancelledOrder = await Order.cancelOrder(req.params.id, req.user.id);

      // Notify farmers about cancellation
      const order = await Order.findById(req.params.id);
      if (order && order.items) {
        const farmerIds = [...new Set(order.items.map(item => item.farmer_id))];
        for (const farmerId of farmerIds) {
          try {
            await Notification.create({
              user_id: farmerId,
              type: 'order_cancelled',
              title: 'Order Cancelled',
              message: `Order #${order.id} has been cancelled by the buyer`,
              reference_id: order.id,
              reference_type: 'order'
            });
          } catch (e) {
            console.error('Notification error:', e);
          }
        }
      }

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: cancelledOrder
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      
      if (error.message === 'Can only cancel pending orders') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to cancel order'
      });
    }
  }
};

module.exports = orderController;
