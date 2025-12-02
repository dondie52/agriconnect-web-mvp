/**
 * BuyerRequest Model for AgriConnect
 * Handles buyer produce requests
 */
const { query } = require('../config/db');

const BuyerRequest = {
  // Create a new buyer request
  async create({ buyer_id, crop_id, quantity, unit = 'kg', max_price, region_id, notes }) {
    const result = await query(
      `INSERT INTO buyer_requests (buyer_id, crop_id, quantity, unit, max_price, region_id, notes, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'open', NOW())
       RETURNING *`,
      [buyer_id, crop_id, quantity, unit, max_price, region_id, notes]
    );
    
    return result.rows[0];
  },

  // Find request by ID
  async findById(id) {
    const result = await query(
      `SELECT br.*, 
              c.name as crop_name, c.category as crop_category,
              r.name as region_name,
              u.name as buyer_name, u.phone as buyer_phone
       FROM buyer_requests br
       JOIN crops c ON br.crop_id = c.id
       LEFT JOIN regions r ON br.region_id = r.id
       JOIN users u ON br.buyer_id = u.id
       WHERE br.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update request
  async update(id, updates) {
    const allowedFields = ['crop_id', 'quantity', 'unit', 'max_price', 'region_id', 'notes', 'status'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      return this.findById(id);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE buyer_requests SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Delete request
  async delete(id) {
    const result = await query(
      'DELETE FROM buyer_requests WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },

  // Get all open requests (for farmers to see)
  async findAll({ crop_id, region_id, status = 'open', page = 1, limit = 10 }) {
    let whereClause = ['br.status = $1'];
    let values = [status];
    let paramCount = 2;

    if (crop_id) {
      whereClause.push(`br.crop_id = $${paramCount}`);
      values.push(crop_id);
      paramCount++;
    }

    if (region_id) {
      whereClause.push(`(br.region_id = $${paramCount} OR br.region_id IS NULL)`);
      values.push(region_id);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await query(
      `SELECT br.*, 
              c.name as crop_name, c.category as crop_category,
              r.name as region_name,
              u.name as buyer_name, u.phone as buyer_phone
       FROM buyer_requests br
       JOIN crops c ON br.crop_id = c.id
       LEFT JOIN regions r ON br.region_id = r.id
       JOIN users u ON br.buyer_id = u.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY br.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM buyer_requests br WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      requests: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get requests for specific buyer
  async findByBuyer(buyer_id, { status, page = 1, limit = 10 }) {
    let whereClause = ['br.buyer_id = $1'];
    let values = [buyer_id];
    let paramCount = 2;

    if (status) {
      whereClause.push(`br.status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await query(
      `SELECT br.*, 
              c.name as crop_name,
              r.name as region_name
       FROM buyer_requests br
       JOIN crops c ON br.crop_id = c.id
       LEFT JOIN regions r ON br.region_id = r.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY br.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM buyer_requests br WHERE ${whereClause.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      requests: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get relevant requests for a farmer (matching their crops/region)
  async findRelevantForFarmer(farmer_id, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT DISTINCT br.*, 
              c.name as crop_name,
              r.name as region_name,
              u.name as buyer_name, u.phone as buyer_phone
       FROM buyer_requests br
       JOIN crops c ON br.crop_id = c.id
       LEFT JOIN regions r ON br.region_id = r.id
       JOIN users u ON br.buyer_id = u.id
       LEFT JOIN listings l ON l.farmer_id = $1 AND l.crop_id = br.crop_id AND l.status = 'active'
       LEFT JOIN users f ON f.id = $1
       WHERE br.status = 'open'
       AND (br.region_id IS NULL OR br.region_id = f.region_id OR l.id IS NOT NULL)
       ORDER BY br.created_at DESC
       LIMIT $2 OFFSET $3`,
      [farmer_id, limit, offset]
    );

    return {
      requests: result.rows,
      page
    };
  },

  // Close a request
  async close(id, buyer_id) {
    const result = await query(
      `UPDATE buyer_requests SET status = 'closed', updated_at = NOW()
       WHERE id = $1 AND buyer_id = $2
       RETURNING *`,
      [id, buyer_id]
    );
    return result.rows[0];
  }
};

module.exports = BuyerRequest;
