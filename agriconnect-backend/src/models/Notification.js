/**
 * Notification Model for AgriConnect
 * Handles user notifications
 */
const { query } = require('../config/db');

const Notification = {
  // Create a notification
  async create({ user_id, type, title, message, reference_id, reference_type }) {
    const result = await query(
      `INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW())
       RETURNING *`,
      [user_id, type, title, message, reference_id, reference_type]
    );
    
    return result.rows[0];
  },

  // Get notifications for user
  async findByUser(user_id, { is_read, page = 1, limit = 20 }) {
    let whereClause = ['user_id = $1'];
    let values = [user_id];
    let paramCount = 2;

    if (is_read !== undefined) {
      whereClause.push(`is_read = $${paramCount}`);
      values.push(is_read);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await query(
      `SELECT * FROM notifications
       WHERE ${whereClause.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM notifications WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      notifications: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get unread count
  async getUnreadCount(user_id) {
    const result = await query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [user_id]
    );
    return parseInt(result.rows[0].count);
  },

  // Mark as read
  async markAsRead(id, user_id) {
    const result = await query(
      `UPDATE notifications SET is_read = true 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, user_id]
    );
    return result.rows[0];
  },

  // Mark all as read
  async markAllAsRead(user_id) {
    const result = await query(
      `UPDATE notifications SET is_read = true 
       WHERE user_id = $1 AND is_read = false
       RETURNING id`,
      [user_id]
    );
    return result.rowCount;
  },

  // Delete notification
  async delete(id, user_id) {
    const result = await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );
    return result.rows[0];
  },

  // Delete old notifications (cleanup)
  async deleteOld(days = 30) {
    const result = await query(
      `DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '${days} days' RETURNING id`
    );
    return result.rowCount;
  },

  // Notification types and helpers
  types: {
    NEW_ORDER: 'new_order',
    ORDER_ACCEPTED: 'order_accepted',
    ORDER_REJECTED: 'order_rejected',
    ORDER_COMPLETED: 'order_completed',
    NEW_REQUEST: 'new_request',
    PRICE_UPDATE: 'price_update',
    WEATHER_ALERT: 'weather_alert',
    SYSTEM: 'system'
  },

  // Create order notification for farmer
  async notifyFarmerNewOrder(farmer_id, order_id, buyer_name, crop_name, quantity) {
    return this.create({
      user_id: farmer_id,
      type: this.types.NEW_ORDER,
      title: 'New Order Received',
      message: `${buyer_name} ordered ${quantity}kg of ${crop_name}`,
      reference_id: order_id,
      reference_type: 'order'
    });
  },

  // Create order status notification for buyer
  async notifyBuyerOrderStatus(buyer_id, order_id, status, crop_name) {
    const statusMessages = {
      accepted: 'Your order has been accepted',
      rejected: 'Your order has been rejected',
      completed: 'Your order has been completed'
    };

    return this.create({
      user_id: buyer_id,
      type: this.types[`ORDER_${status.toUpperCase()}`],
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `${statusMessages[status]} for ${crop_name}`,
      reference_id: order_id,
      reference_type: 'order'
    });
  },

  // Create new request notification for relevant farmers
  async notifyFarmersNewRequest(farmer_ids, request_id, crop_name, quantity) {
    const notifications = farmer_ids.map(farmer_id => 
      this.create({
        user_id: farmer_id,
        type: this.types.NEW_REQUEST,
        title: 'New Buyer Request',
        message: `A buyer is looking for ${quantity}kg of ${crop_name}`,
        reference_id: request_id,
        reference_type: 'request'
      })
    );
    return Promise.all(notifications);
  }
};

module.exports = Notification;
