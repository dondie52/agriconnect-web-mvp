/**
 * Dashboard Controller for AgriConnect
 * Provides optimized stats endpoints for real-time dashboard updates
 */
const { pool } = require('../config/db');

const dashboardController = {
  /**
   * Get dashboard statistics for a farmer
   * Optimized queries for fast real-time updates
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      if (userRole === 'farmer') {
        // Farmer dashboard stats
        const [
          listingsResult,
          pendingOrdersResult,
          revenueResult,
          buyerRequestsResult
        ] = await Promise.all([
          // Count active listings
          pool.query(
            `SELECT COUNT(*) as active_listings 
             FROM listings 
             WHERE farmer_id = $1 AND status = 'active'`,
            [userId]
          ),
          // Count pending orders
          pool.query(
            `SELECT COUNT(*) as pending_orders 
             FROM orders 
             WHERE farmer_id = $1 AND status = 'pending'`,
            [userId]
          ),
          // Sum completed order revenue
          pool.query(
            `SELECT COALESCE(SUM(total_price), 0) as total_revenue 
             FROM orders 
             WHERE farmer_id = $1 AND status = 'completed'`,
            [userId]
          ),
          // Count relevant buyer requests (from same region)
          pool.query(
            `SELECT COUNT(*) as buyer_requests 
             FROM buyer_requests br
             JOIN users u ON u.id = $1
             WHERE br.status = 'open' 
             AND (br.region_id = u.region_id OR br.region_id IS NULL)`,
            [userId]
          )
        ]);

        return res.json({
          success: true,
          data: {
            active_listings: parseInt(listingsResult.rows[0]?.active_listings || 0),
            pending_orders: parseInt(pendingOrdersResult.rows[0]?.pending_orders || 0),
            total_revenue: parseFloat(revenueResult.rows[0]?.total_revenue || 0),
            buyer_requests: parseInt(buyerRequestsResult.rows[0]?.buyer_requests || 0),
            updated_at: new Date().toISOString()
          }
        });

      } else if (userRole === 'buyer') {
        // Buyer dashboard stats
        const [
          ordersResult,
          requestsResult,
          spendingResult
        ] = await Promise.all([
          // Count pending orders
          pool.query(
            `SELECT COUNT(*) as pending_orders 
             FROM orders 
             WHERE buyer_id = $1 AND status = 'pending'`,
            [userId]
          ),
          // Count open requests
          pool.query(
            `SELECT COUNT(*) as open_requests 
             FROM buyer_requests 
             WHERE buyer_id = $1 AND status = 'open'`,
            [userId]
          ),
          // Sum total spending
          pool.query(
            `SELECT COALESCE(SUM(total_price), 0) as total_spending 
             FROM orders 
             WHERE buyer_id = $1 AND status = 'completed'`,
            [userId]
          )
        ]);

        return res.json({
          success: true,
          data: {
            pending_orders: parseInt(ordersResult.rows[0]?.pending_orders || 0),
            open_requests: parseInt(requestsResult.rows[0]?.open_requests || 0),
            total_spending: parseFloat(spendingResult.rows[0]?.total_spending || 0),
            updated_at: new Date().toISOString()
          }
        });

      } else if (userRole === 'admin') {
        // Admin dashboard stats
        const [
          usersResult,
          listingsResult,
          ordersResult,
          transactionsResult
        ] = await Promise.all([
          // Count users by role
          pool.query(
            `SELECT role, COUNT(*) as count 
             FROM users 
             WHERE is_active = true 
             GROUP BY role`
          ),
          // Count active listings
          pool.query(
            `SELECT COUNT(*) as active_listings 
             FROM listings 
             WHERE status = 'active'`
          ),
          // Count orders by status
          pool.query(
            `SELECT status, COUNT(*) as count 
             FROM orders 
             GROUP BY status`
          ),
          // Total transaction value
          pool.query(
            `SELECT COALESCE(SUM(total_price), 0) as total_value 
             FROM orders 
             WHERE status = 'completed'`
          )
        ]);

        const userCounts = {};
        usersResult.rows.forEach(row => {
          userCounts[row.role] = parseInt(row.count);
        });

        const orderCounts = {};
        ordersResult.rows.forEach(row => {
          orderCounts[row.status] = parseInt(row.count);
        });

        return res.json({
          success: true,
          data: {
            total_farmers: userCounts.farmer || 0,
            total_buyers: userCounts.buyer || 0,
            total_admins: userCounts.admin || 0,
            active_listings: parseInt(listingsResult.rows[0]?.active_listings || 0),
            pending_orders: orderCounts.pending || 0,
            completed_orders: orderCounts.completed || 0,
            total_transaction_value: parseFloat(transactionsResult.rows[0]?.total_value || 0),
            updated_at: new Date().toISOString()
          }
        });
      }

      // Default response for unknown roles
      return res.json({
        success: true,
        data: {
          updated_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats'
      });
    }
  }
};

module.exports = dashboardController;




