/**
 * Analytics Model for AgriConnect
 * Tracks listing views, clicks, and contact events
 */
const { pool } = require('../config/db');

const Analytics = {
  // Track a listing view
  async trackView(listing_id, viewer_id = null) {
    await pool.query(
      `INSERT INTO analytics_events (listing_id, viewer_id, event_type, created_at)
       VALUES ($1, $2, 'view', NOW())`,
      [listing_id, viewer_id]
    );

    // Also increment the views counter on the listing
    await pool.query(
      'UPDATE listings SET views = COALESCE(views, 0) + 1 WHERE id = $1',
      [listing_id]
    );
  },

  // Track a contact click
  async trackContact(listing_id, viewer_id) {
    await pool.query(
      `INSERT INTO analytics_events (listing_id, viewer_id, event_type, created_at)
       VALUES ($1, $2, 'contact', NOW())`,
      [listing_id, viewer_id]
    );
  },

  // Track an order placement
  async trackOrder(listing_id, viewer_id) {
    await pool.query(
      `INSERT INTO analytics_events (listing_id, viewer_id, event_type, created_at)
       VALUES ($1, $2, 'order', NOW())`,
      [listing_id, viewer_id]
    );
  },

  // Get analytics for a farmer's listings
  async getfarmerAnalytics(farmer_id, days = 7) {
    const result = await pool.query(
      `SELECT 
        DATE(ae.created_at) as date,
        ae.event_type,
        COUNT(*) as count
       FROM analytics_events ae
       JOIN listings l ON ae.listing_id = l.id
       WHERE l.farmer_id = $1 
       AND ae.created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(ae.created_at), ae.event_type
       ORDER BY date DESC`,
      [farmer_id]
    );

    return result.rows;
  },

  // Get analytics summary for farmer dashboard
  async getFarmerSummary(farmer_id, days = 7) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE ae.event_type = 'view') as total_views,
        COUNT(*) FILTER (WHERE ae.event_type = 'contact') as total_contacts,
        COUNT(*) FILTER (WHERE ae.event_type = 'order') as total_orders,
        COUNT(DISTINCT ae.viewer_id) FILTER (WHERE ae.viewer_id IS NOT NULL) as unique_visitors
       FROM analytics_events ae
       JOIN listings l ON ae.listing_id = l.id
       WHERE l.farmer_id = $1 
       AND ae.created_at >= NOW() - INTERVAL '${days} days'`,
      [farmer_id]
    );

    return result.rows[0];
  },

  // Get top performing listings for a farmer
  async getTopListings(farmer_id, limit = 5) {
    const result = await pool.query(
      `SELECT l.id, l.crop_id, c.name as crop_name, l.price, l.quantity,
              l.views,
              COUNT(*) FILTER (WHERE ae.event_type = 'contact') as contacts,
              COUNT(*) FILTER (WHERE ae.event_type = 'order') as orders
       FROM listings l
       JOIN crops c ON l.crop_id = c.id
       LEFT JOIN analytics_events ae ON l.id = ae.listing_id
       WHERE l.farmer_id = $1 AND l.status = 'active'
       GROUP BY l.id, c.name
       ORDER BY l.views DESC, contacts DESC
       LIMIT $2`,
      [farmer_id, limit]
    );

    return result.rows;
  },

  // Get daily trends for a listing
  async getListingTrends(listing_id, days = 7) {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        event_type,
        COUNT(*) as count
       FROM analytics_events
       WHERE listing_id = $1 
       AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at), event_type
       ORDER BY date`,
      [listing_id]
    );

    return result.rows;
  },

  // Admin: Get platform-wide analytics
  async getPlatformAnalytics(days = 30) {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        event_type,
        COUNT(*) as count
       FROM analytics_events
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at), event_type
       ORDER BY date`
    );

    return result.rows;
  },

  // Admin: Get overview stats
  async getPlatformOverview() {
    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'farmer') as total_farmers,
        (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_buyers,
        (SELECT COUNT(*) FROM listings WHERE status = 'active') as active_listings,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'completed') as completed_orders,
        (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status = 'completed') as total_transaction_value`
    );

    return result.rows[0];
  }
};

module.exports = Analytics;
