/**
 * Cart Model for AgriConnect
 * Handles shopping cart operations for buyers
 */
const { pool } = require('../config/db');

const Cart = {
  /**
   * Add item to cart (or update quantity if already exists)
   */
  async addItem({ user_id, listing_id, quantity }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Verify listing exists and is active
      const listingResult = await client.query(
        `SELECT id, quantity as available_quantity, price, farmer_id, status
         FROM listings
         WHERE id = $1`,
        [listing_id]
      );

      if (listingResult.rows.length === 0) {
        throw new Error('Listing not found');
      }

      const listing = listingResult.rows[0];

      if (listing.status !== 'active') {
        throw new Error('Listing is not available');
      }

      // Prevent buying own listing
      if (listing.farmer_id === user_id) {
        throw new Error('Cannot add your own listing to cart');
      }

      // Check if there's enough stock
      if (listing.available_quantity < quantity) {
        throw new Error(`Only ${listing.available_quantity} units available`);
      }

      // Upsert cart item (insert or update)
      const result = await client.query(
        `INSERT INTO cart_items (user_id, listing_id, quantity, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, listing_id)
         DO UPDATE SET quantity = $3, updated_at = NOW()
         RETURNING *`,
        [user_id, listing_id, quantity]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get cart items for a user with full listing details
   */
  async getByUser(user_id) {
    const result = await pool.query(
      `SELECT 
        ci.id,
        ci.user_id,
        ci.listing_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        l.price as unit_price,
        l.quantity as available_quantity,
        l.unit,
        l.status as listing_status,
        l.images,
        c.name as crop_name,
        c.category as crop_category,
        r.name as region_name,
        u.id as farmer_id,
        u.name as farmer_name,
        u.phone as farmer_phone,
        (ci.quantity * l.price) as subtotal
       FROM cart_items ci
       JOIN listings l ON ci.listing_id = l.id
       JOIN crops c ON l.crop_id = c.id
       JOIN regions r ON l.region_id = r.id
       JOIN users u ON l.farmer_id = u.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [user_id]
    );

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    const items = result.rows.map(item => {
      totalItems += parseFloat(item.quantity);
      totalPrice += parseFloat(item.subtotal);
      return {
        ...item,
        subtotal: parseFloat(item.subtotal)
      };
    });

    return {
      items,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100,
      itemCount: items.length
    };
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity({ id, user_id, quantity }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get cart item with listing info
      const cartResult = await client.query(
        `SELECT ci.*, l.quantity as available_quantity, l.status as listing_status
         FROM cart_items ci
         JOIN listings l ON ci.listing_id = l.id
         WHERE ci.id = $1 AND ci.user_id = $2`,
        [id, user_id]
      );

      if (cartResult.rows.length === 0) {
        throw new Error('Cart item not found');
      }

      const cartItem = cartResult.rows[0];

      if (cartItem.listing_status !== 'active') {
        throw new Error('This listing is no longer available');
      }

      if (cartItem.available_quantity < quantity) {
        throw new Error(`Only ${cartItem.available_quantity} units available`);
      }

      const result = await client.query(
        `UPDATE cart_items 
         SET quantity = $1, updated_at = NOW() 
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [quantity, id, user_id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Remove item from cart
   */
  async removeItem({ id, user_id }) {
    const result = await pool.query(
      `DELETE FROM cart_items 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      throw new Error('Cart item not found');
    }

    return result.rows[0];
  },

  /**
   * Clear entire cart for a user
   */
  async clearCart(user_id) {
    await pool.query(
      `DELETE FROM cart_items WHERE user_id = $1`,
      [user_id]
    );
    return { cleared: true };
  },

  /**
   * Get cart item count for a user
   */
  async getItemCount(user_id) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM cart_items WHERE user_id = $1`,
      [user_id]
    );
    return parseInt(result.rows[0].count);
  },

  /**
   * Validate cart before checkout (check all items are still available)
   */
  async validateCart(user_id) {
    const result = await pool.query(
      `SELECT 
        ci.id,
        ci.quantity as requested_quantity,
        l.quantity as available_quantity,
        l.status as listing_status,
        c.name as crop_name
       FROM cart_items ci
       JOIN listings l ON ci.listing_id = l.id
       JOIN crops c ON l.crop_id = c.id
       WHERE ci.user_id = $1`,
      [user_id]
    );

    const issues = [];
    
    for (const item of result.rows) {
      if (item.listing_status !== 'active') {
        issues.push({
          id: item.id,
          issue: 'unavailable',
          message: `${item.crop_name} is no longer available`
        });
      } else if (item.available_quantity < item.requested_quantity) {
        issues.push({
          id: item.id,
          issue: 'insufficient_stock',
          message: `Only ${item.available_quantity} units of ${item.crop_name} available`,
          available: item.available_quantity
        });
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
};

module.exports = Cart;
