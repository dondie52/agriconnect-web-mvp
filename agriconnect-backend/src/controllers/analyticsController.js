/**
 * Analytics Controller for AgriConnect
 * Handles analytics and tracking operations
 */
const Analytics = require('../models/Analytics');

const analyticsController = {
  // Track a listing view (public)
  async trackView(req, res) {
    try {
      const { listing_id } = req.body;

      await Analytics.trackView(listing_id, req.user?.id);

      res.json({
        success: true,
        message: 'View tracked'
      });
    } catch (error) {
      console.error('Track view error:', error);
      // Don't fail the request if tracking fails
      res.json({ success: true });
    }
  },

  // Track a contact click
  async trackContact(req, res) {
    try {
      const { listing_id } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      await Analytics.trackContact(listing_id, req.user.id);

      res.json({
        success: true,
        message: 'Contact tracked'
      });
    } catch (error) {
      console.error('Track contact error:', error);
      res.json({ success: true });
    }
  },

  // Get farmer's analytics
  async getFarmerAnalytics(req, res) {
    try {
      const { days = 7 } = req.query;

      const analytics = await Analytics.getfarmerAnalytics(
        req.user.id,
        parseInt(days)
      );

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get farmer analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics'
      });
    }
  },

  // Get farmer's analytics summary (dashboard widget)
  async getFarmerSummary(req, res) {
    try {
      const { days = 7 } = req.query;

      const summary = await Analytics.getFarmerSummary(
        req.user.id,
        parseInt(days)
      );

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get farmer summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics summary'
      });
    }
  },

  // Get top performing listings
  async getTopListings(req, res) {
    try {
      const { limit = 5 } = req.query;

      const listings = await Analytics.getTopListings(
        req.user.id,
        parseInt(limit)
      );

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get top listings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top listings'
      });
    }
  },

  // Get trends for a specific listing
  async getListingTrends(req, res) {
    try {
      const { days = 7 } = req.query;

      const trends = await Analytics.getListingTrends(
        req.params.listing_id,
        parseInt(days)
      );

      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      console.error('Get listing trends error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch listing trends'
      });
    }
  },

  // Admin: Get platform-wide analytics
  async getPlatformAnalytics(req, res) {
    try {
      const { days = 30 } = req.query;

      const analytics = await Analytics.getPlatformAnalytics(parseInt(days));

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get platform analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch platform analytics'
      });
    }
  },

  // Admin: Get platform overview stats
  async getPlatformOverview(req, res) {
    try {
      const overview = await Analytics.getPlatformOverview();

      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('Get platform overview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch platform overview'
      });
    }
  }
};

module.exports = analyticsController;
