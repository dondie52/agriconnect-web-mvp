/**
 * Notification Controller for AgriConnect
 * Handles notification operations
 */
const Notification = require('../models/Notification');

const notificationController = {
  // Get user's notifications
  async getAll(req, res) {
    try {
      const { is_read, page = 1, limit = 20 } = req.query;

      const isReadBool = is_read === 'true' ? true : is_read === 'false' ? false : undefined;

      const result = await Notification.findByUser(req.user.id, {
        is_read: isReadBool,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  },

  // Get unread count
  async getUnreadCount(req, res) {
    try {
      const count = await Notification.getUnreadCount(req.user.id);

      res.json({
        success: true,
        data: { unread_count: count }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count'
      });
    }
  },

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const notification = await Notification.markAsRead(req.params.id, req.user.id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      const count = await Notification.markAllAsRead(req.user.id);

      res.json({
        success: true,
        message: `${count} notifications marked as read`
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read'
      });
    }
  },

  // Delete notification
  async delete(req, res) {
    try {
      const deleted = await Notification.delete(req.params.id, req.user.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  }
};

module.exports = notificationController;
