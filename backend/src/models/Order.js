/**
 * Order Model for AgriConnect
 * Handles order data operations between buyers and farmers
 */
const { query, getClient } = require('../config/db');

const Order = {
  // Create a new order
  async create({ listing_id, buyer_id, quantity, delivery_preference = 'pickup', notes }) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Get listing details and check availability
      const listingResult = await client.query(
        `SELECT l.*, u.id as farmer_id, u.name as farmer_name
         FROM listings l
         JOIN users u ON l.farmer_id = u.id
         WHERE l.id = $1 AND l.status = 'active'
         FOR UPDATE`,
        [listing_id]
      );

      if (listingResult.rows.length === 0) {
        throw new Error('Listing not available');
      }

      const listing = listingResult.rows[0];

      if (listing.quantity < quantity) {
        throw new Error('Requested quantity exceeds available stock');
      }

      // Calculate total price
      const total_price = listing.price * quantity;

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (listing_id, buyer_id, farmer_id, quantity, unit_price, total_price, delivery_preference, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
         RETURNING *`,
        [listing_id, buyer_id, listing.farmer_id, quantity, listing.price, total_price, delivery_preference, notes]
      );

      // Update listing quantity
      await client.query(
        `UPDATE listings SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2`,
        [quantity, listing_id]
      );

      await client.query('COMMIT');
      
      return {
        ...orderResult.rows[0],
        listing_crop: listing.crop_name,
        farmer_name: listing.farmer_name
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Find order by ID
  async findById(id) {
    const result = await query(
      `SELECT o.*, 
              l.crop_id, c.name as crop_name, l.images,
              b.name as buyer_name, b.phone as buyer_phone,
              f.name as farmer_name, f.phone as farmer_phone,
              r.name as region_name
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       JOIN crops c ON l.crop_id = c.id
       JOIN users b ON o.buyer_id = b.id
       JOIN users f ON o.farmer_id = f.id
       JOIN regions r ON l.region_id = r.id
       WHERE o.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update order status (farmer accepts/rejects)
  async updateStatus(id, status, farmer_id) {
    const allowedStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Verify farmer owns this order
      const orderResult = await client.query(
        `SELECT * FROM orders WHERE id = $1 AND farmer_id = $2 FOR UPDATE`,
        [id, farmer_id]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found or unauthorized');
      }

      const order = orderResult.rows[0];

      // If rejecting, restore listing quantity
      if (status === 'rejected' && order.status === 'pending') {
        await client.query(
          `UPDATE listings SET quantity = quantity + $1 WHERE id = $2`,
          [order.quantity, order.listing_id]
        );
      }

      // Update order status
      const updateResult = await client.query(
        `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [status, id]
      );

      await client.query('COMMIT');
      
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Get orders for farmer
  async findByFarmer(farmer_id, { status, page = 1, limit = 10 }) {
    let whereClause = ['o.farmer_id = $1'];
    let values = [farmer_id];
    let paramCount = 2;

    if (status) {
      whereClause.push(`o.status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await query(
      `SELECT o.*, 
              c.name as crop_name,
              b.name as buyer_name, b.phone as buyer_phone
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       JOIN crops c ON l.crop_id = c.id
       JOIN users b ON o.buyer_id = b.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY o.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM orders o WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      orders: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get orders for buyer
  async findByBuyer(buyer_id, { status, page = 1, limit = 10 }) {
    let whereClause = ['o.buyer_id = $1'];
    let values = [buyer_id];
    let paramCount = 2;

    if (status) {
      whereClause.push(`o.status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await query(
      `SELECT o.*, 
              c.name as crop_name,
              f.name as farmer_name, f.phone as farmer_phone,
              r.name as region_name
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       JOIN crops c ON l.crop_id = c.id
       JOIN users f ON o.farmer_id = f.id
       JOIN regions r ON l.region_id = r.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY o.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM orders o WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      orders: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get order statistics
  async getStats(farmer_id) {
    const result = await query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0) as total_revenue
       FROM orders
       WHERE farmer_id = $1`,
      [farmer_id]
    );
    return result.rows[0];
  }
};

module.exports = Order;
