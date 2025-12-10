/**
 * Listing Model for AgriConnect
 * Handles produce listing data operations
 */
const { pool } = require('../config/db');

const Listing = {
  // Create a new listing
  async create({ farmer_id, crop_id, quantity, unit = 'kg', price, region_id, description, images = [] }) {
    const result = await pool.query(
      `INSERT INTO listings (farmer_id, crop_id, quantity, unit, price, region_id, description, images, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW())
       RETURNING *`,
      [farmer_id, crop_id, quantity, unit, price, region_id, description, JSON.stringify(images)]
    );
    
    return result.rows[0];
  },

  // Find listing by ID with full details
  async findById(id) {
    const result = await pool.query(
      `SELECT l.*, 
              c.name as crop_name, c.category as crop_category,
              r.name as region_name,
              u.name as farmer_name, u.phone as farmer_phone
       FROM listings l
       JOIN crops c ON l.crop_id = c.id
       JOIN regions r ON l.region_id = r.id
       JOIN users u ON l.farmer_id = u.id
       WHERE l.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update listing
  async update(id, updates) {
    const allowedFields = ['crop_id', 'quantity', 'unit', 'price', 'region_id', 'description', 'status', 'images'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'images') {
          setClause.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          setClause.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      return this.findById(id);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE listings SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Delete listing (soft delete by setting status to 'deleted')
  async delete(id) {
    const result = await pool.query(
      `UPDATE listings SET status = 'deleted', updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  },

  // Get all listings with filters
  async findAll({ 
    crop_id, region_id, min_price, max_price, status = 'active', 
    farmer_id, search, page = 1, limit = 12, sort_by = 'created_at', sort_order = 'DESC' 
  }) {
    let whereClause = ['l.status = $1'];
    let values = [status];
    let paramCount = 2;

    if (crop_id) {
      whereClause.push(`l.crop_id = $${paramCount}`);
      values.push(crop_id);
      paramCount++;
    }

    if (region_id) {
      whereClause.push(`l.region_id = $${paramCount}`);
      values.push(region_id);
      paramCount++;
    }

    if (min_price) {
      whereClause.push(`l.price >= $${paramCount}`);
      values.push(min_price);
      paramCount++;
    }

    if (max_price) {
      whereClause.push(`l.price <= $${paramCount}`);
      values.push(max_price);
      paramCount++;
    }

    if (farmer_id) {
      whereClause.push(`l.farmer_id = $${paramCount}`);
      values.push(farmer_id);
      paramCount++;
    }

    if (search) {
      whereClause.push(`(c.name ILIKE $${paramCount} OR l.description ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    const allowedSortFields = ['created_at', 'price', 'quantity'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    values.push(limit, offset);

    const result = await pool.query(
      `SELECT l.*, 
              c.name as crop_name, c.category as crop_category,
              r.name as region_name,
              u.name as farmer_name
       FROM listings l
       JOIN crops c ON l.crop_id = c.id
       JOIN regions r ON l.region_id = r.id
       JOIN users u ON l.farmer_id = u.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY l.${sortField} ${sortDirection}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM listings l
       JOIN crops c ON l.crop_id = c.id
       WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      listings: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get farmer's listings
  async findByFarmer(farmer_id, { status, page = 1, limit = 10 }) {
    let whereClause = ['farmer_id = $1'];
    let values = [farmer_id];
    let paramCount = 2;

    if (status) {
      whereClause.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    } else {
      whereClause.push(`status != 'deleted'`);
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await pool.query(
      `SELECT l.*, 
              c.name as crop_name,
              r.name as region_name
       FROM listings l
       JOIN crops c ON l.crop_id = c.id
       JOIN regions r ON l.region_id = r.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY l.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM listings WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      listings: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Increment view count
  async incrementViews(id) {
    await pool.query(
      'UPDATE listings SET views = views + 1 WHERE id = $1',
      [id]
    );
  },

  // Get listing statistics for farmer
  async getStats(farmer_id) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as active_listings,
        COUNT(*) FILTER (WHERE status = 'sold') as sold_listings,
        COALESCE(SUM(views), 0) as total_views,
        COALESCE(SUM(CASE WHEN status = 'sold' THEN price * quantity ELSE 0 END), 0) as total_revenue
       FROM listings
       WHERE farmer_id = $1 AND status != 'deleted'`,
      [farmer_id]
    );
    return result.rows[0];
  }
};

module.exports = Listing;
