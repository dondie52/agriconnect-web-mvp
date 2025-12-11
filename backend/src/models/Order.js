/**
 * Order Model for AgriConnect
 * Handles order data operations between buyers and farmers
 * Updated for cart-based checkout system with delivery features
 */
const { pool } = require('../config/db');

const Order = {
  /**
   * Create order from cart (checkout)
   * Converts all cart items into order_items and creates a single order
   * Now supports enhanced delivery options with address, coordinates, and delivery fee
   */
  async createFromCart({ 
    buyer_id, 
    delivery_type = 'pickup',
    delivery_preference = 'pickup', // For backward compatibility
    address_text = null,
    delivery_address = null, // For backward compatibility
    latitude = null,
    longitude = null,
    phone_number = null,
    delivery_fee = 0,
    total_amount = null,
    notes = null 
  }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get all cart items for the buyer with listing details
      const cartResult = await client.query(
        `SELECT 
          ci.id as cart_item_id,
          ci.listing_id,
          ci.quantity,
          l.price,
          l.quantity as available_quantity,
          l.status as listing_status,
          l.farmer_id,
          c.name as crop_name
         FROM cart_items ci
         JOIN listings l ON ci.listing_id = l.id
         JOIN crops c ON l.crop_id = c.id
         WHERE ci.user_id = $1
         FOR UPDATE OF l`,
        [buyer_id]
      );

      if (cartResult.rows.length === 0) {
        throw new Error('Cart is empty');
      }

      // Validate all cart items
      let itemsTotal = 0;
      const orderItems = [];

      for (const item of cartResult.rows) {
        if (item.listing_status !== 'active') {
          throw new Error(`${item.crop_name} is no longer available`);
        }
        if (item.available_quantity < item.quantity) {
          throw new Error(`Only ${item.available_quantity} units of ${item.crop_name} available`);
        }
        
        const itemTotal = item.price * item.quantity;
        itemsTotal += itemTotal;
        
        orderItems.push({
          listing_id: item.listing_id,
          farmer_id: item.farmer_id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: itemTotal,
          crop_name: item.crop_name
        });
      }

      // Calculate total amount (items + delivery fee)
      const calculatedTotalAmount = total_amount || (itemsTotal + (delivery_fee || 0));
      
      // Use delivery_type or fall back to delivery_preference for backward compatibility
      const finalDeliveryType = delivery_type || delivery_preference || 'pickup';
      
      // Use address_text or fall back to delivery_address for backward compatibility
      const finalAddressText = address_text || delivery_address || null;

      // Create the order with enhanced delivery fields
      const orderResult = await client.query(
        `INSERT INTO orders (
          buyer_id, 
          total_price, 
          total_amount,
          delivery_preference,
          delivery_type,
          delivery_address,
          address_text,
          latitude,
          longitude,
          phone_number,
          delivery_fee,
          notes, 
          status, 
          created_at
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW())
         RETURNING *`,
        [
          buyer_id, 
          itemsTotal, // total_price (items only, for backward compatibility)
          calculatedTotalAmount, // total_amount (items + delivery fee)
          finalDeliveryType, // delivery_preference (backward compatibility)
          finalDeliveryType, // delivery_type
          finalAddressText, // delivery_address (backward compatibility)
          finalAddressText, // address_text
          latitude,
          longitude,
          phone_number,
          delivery_fee || 0,
          notes
        ]
      );

      const order = orderResult.rows[0];

      // Create order items and update listing quantities
      for (const item of orderItems) {
        // Insert order item
        await client.query(
          `INSERT INTO order_items (order_id, listing_id, farmer_id, quantity, unit_price, total_price, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [order.id, item.listing_id, item.farmer_id, item.quantity, item.unit_price, item.total_price]
        );

        // Update listing quantity
        await client.query(
          `UPDATE listings SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2`,
          [item.quantity, item.listing_id]
        );
      }

      // Clear the cart
      await client.query(
        `DELETE FROM cart_items WHERE user_id = $1`,
        [buyer_id]
      );

      await client.query('COMMIT');
      
      return {
        ...order,
        items: orderItems,
        itemCount: orderItems.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Legacy: Create a single-item order (for backward compatibility)
   */
  async create({ listing_id, buyer_id, quantity, delivery_preference = 'pickup', notes }) {
    const client = await pool.connect();
    
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
        `INSERT INTO orders (buyer_id, total_price, total_amount, delivery_preference, delivery_type, notes, status, created_at)
         VALUES ($1, $2, $2, $3, $3, $4, 'pending', NOW())
         RETURNING *`,
        [buyer_id, total_price, delivery_preference, notes]
      );

      const order = orderResult.rows[0];

      // Create order item
      await client.query(
        `INSERT INTO order_items (order_id, listing_id, farmer_id, quantity, unit_price, total_price, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [order.id, listing_id, listing.farmer_id, quantity, listing.price, total_price]
      );

      // Update listing quantity
      await client.query(
        `UPDATE listings SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2`,
        [quantity, listing_id]
      );

      await client.query('COMMIT');
      
      return {
        ...order,
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

  // Find order by ID with all items
  async findById(id) {
    // Get order details with enhanced delivery fields
    const orderResult = await pool.query(
      `SELECT o.*, 
              o.total_amount,
              o.address_text,
              o.latitude,
              o.longitude,
              o.phone_number,
              o.delivery_type,
              o.delivery_fee,
              b.name as buyer_name, b.phone as buyer_phone
       FROM orders o
       JOIN users b ON o.buyer_id = b.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, 
              l.images, l.unit,
              c.name as crop_name, c.category as crop_category,
              r.name as region_name,
              f.name as farmer_name, f.phone as farmer_phone
       FROM order_items oi
       JOIN listings l ON oi.listing_id = l.id
       JOIN crops c ON l.crop_id = c.id
       JOIN regions r ON l.region_id = r.id
       JOIN users f ON oi.farmer_id = f.id
       WHERE oi.order_id = $1`,
      [id]
    );

    return {
      ...order,
      items: itemsResult.rows,
      itemCount: itemsResult.rows.length
    };
  },

  // Update order status (farmer accepts/rejects)
  async updateStatus(id, status, user_id, userRole = 'farmer') {
    const allowedStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get order and verify authorization
      const orderResult = await client.query(
        `SELECT o.*, 
                EXISTS(SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.farmer_id = $2) as is_farmer_order
         FROM orders o 
         WHERE o.id = $1 
         FOR UPDATE`,
        [id, user_id]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult.rows[0];

      // Authorization check
      if (userRole === 'farmer' && !order.is_farmer_order) {
        throw new Error('Not authorized to update this order');
      }
      if (userRole === 'buyer' && order.buyer_id !== user_id) {
        throw new Error('Not authorized to update this order');
      }

      // If rejecting or cancelling, restore listing quantities
      if ((status === 'rejected' || status === 'cancelled') && order.status === 'pending') {
        const itemsResult = await client.query(
          `SELECT listing_id, quantity FROM order_items WHERE order_id = $1`,
          [id]
        );

        for (const item of itemsResult.rows) {
          await client.query(
            `UPDATE listings SET quantity = quantity + $1 WHERE id = $2`,
            [item.quantity, item.listing_id]
          );
        }
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

  // Cancel order (buyer only, pending orders only)
  async cancelOrder(id, buyer_id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get order and verify ownership
      const orderResult = await client.query(
        `SELECT * FROM orders WHERE id = $1 AND buyer_id = $2 FOR UPDATE`,
        [id, buyer_id]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult.rows[0];

      if (order.status !== 'pending') {
        throw new Error('Can only cancel pending orders');
      }

      // Restore listing quantities
      const itemsResult = await client.query(
        `SELECT listing_id, quantity FROM order_items WHERE order_id = $1`,
        [id]
      );

      for (const item of itemsResult.rows) {
        await client.query(
          `UPDATE listings SET quantity = quantity + $1 WHERE id = $2`,
          [item.quantity, item.listing_id]
        );
      }

      // Update order status
      const updateResult = await client.query(
        `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
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

  // Get orders for farmer (orders containing their items)
  async findByFarmer(farmer_id, { status, page = 1, limit = 10 }) {
    let whereClause = ['oi.farmer_id = $1'];
    let values = [farmer_id];
    let paramCount = 2;

    if (status) {
      whereClause.push(`o.status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    // Get distinct orders that have items from this farmer with enhanced delivery fields
    const result = await pool.query(
      `SELECT DISTINCT ON (o.id)
              o.*,
              o.total_amount,
              o.address_text,
              o.latitude,
              o.longitude,
              o.phone_number,
              o.delivery_type,
              o.delivery_fee,
              b.name as buyer_name, b.phone as buyer_phone,
              (SELECT json_agg(json_build_object(
                'id', oi2.id,
                'listing_id', oi2.listing_id,
                'quantity', oi2.quantity,
                'unit_price', oi2.unit_price,
                'total_price', oi2.total_price,
                'crop_name', c.name,
                'unit', l.unit
              ))
              FROM order_items oi2
              JOIN listings l ON oi2.listing_id = l.id
              JOIN crops c ON l.crop_id = c.id
              WHERE oi2.order_id = o.id AND oi2.farmer_id = $1) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN users b ON o.buyer_id = b.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY o.id, o.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Re-sort by created_at since DISTINCT ON affects ordering
    const orders = result.rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT o.id) 
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      orders,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get orders for buyer with enhanced delivery fields
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

    const result = await pool.query(
      `SELECT o.*,
              o.total_amount,
              o.address_text,
              o.latitude,
              o.longitude,
              o.phone_number,
              o.delivery_type,
              o.delivery_fee,
              (SELECT json_agg(json_build_object(
                'id', oi.id,
                'listing_id', oi.listing_id,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price,
                'total_price', oi.total_price,
                'crop_name', c.name,
                'crop_category', c.category,
                'unit', l.unit,
                'images', l.images,
                'farmer_id', oi.farmer_id,
                'farmer_name', f.name,
                'farmer_phone', f.phone,
                'region_name', r.name
              ))
              FROM order_items oi
              JOIN listings l ON oi.listing_id = l.id
              JOIN crops c ON l.crop_id = c.id
              JOIN users f ON oi.farmer_id = f.id
              JOIN regions r ON l.region_id = r.id
              WHERE oi.order_id = o.id) as items
       FROM orders o
       WHERE ${whereClause.join(' AND ')}
       ORDER BY o.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM orders o WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      orders: result.rows.map(order => ({
        ...order,
        itemCount: order.items?.length || 0
      })),
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get order statistics
  async getStats(farmer_id) {
    const result = await pool.query(
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
