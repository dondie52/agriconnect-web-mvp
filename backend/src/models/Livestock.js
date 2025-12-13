/**
 * Livestock Model for AgriConnect
 * Handles livestock tracking operations for farmers
 */
const { pool } = require('../config/db');

const Livestock = {
  /**
   * Create a new livestock record
   */
  async create({ farmer_id, type, breed, gender, age_months, weight_kg, tag_number, status = 'healthy', location, notes }) {
    const result = await pool.query(
      `INSERT INTO livestock (farmer_id, type, breed, gender, age_months, weight_kg, tag_number, status, location, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [farmer_id, type, breed, gender, age_months, weight_kg, tag_number, status, location, notes]
    );
    return result.rows[0];
  },

  /**
   * Find livestock by ID
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT l.*, u.name as farmer_name, u.phone as farmer_phone, r.name as region_name
       FROM livestock l
       JOIN users u ON l.farmer_id = u.id
       LEFT JOIN regions r ON u.region_id = r.id
       WHERE l.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Find all livestock for a farmer with optional filters
   */
  async findByFarmer(farmer_id, { type, status, search, page = 1, limit = 20 } = {}) {
    let query = `
      SELECT l.*
      FROM livestock l
      WHERE l.farmer_id = $1
    `;
    const params = [farmer_id];
    let paramCount = 2;

    if (type) {
      query += ` AND l.type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (status) {
      query += ` AND l.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (l.tag_number ILIKE $${paramCount} OR l.breed ILIKE $${paramCount} OR l.location ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(
      query.replace('SELECT l.*', 'SELECT COUNT(*) as total'),
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Add ordering and pagination
    query += ` ORDER BY l.created_at DESC`;
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
      livestock: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  /**
   * Update livestock record
   */
  async update(id, farmer_id, updates) {
    const allowedFields = ['type', 'breed', 'gender', 'age_months', 'weight_kg', 'tag_number', 'status', 'location', 'notes'];
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
    values.push(id, farmer_id);

    const result = await pool.query(
      `UPDATE livestock SET ${setClause.join(', ')} 
       WHERE id = $${paramCount} AND farmer_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Livestock not found or unauthorized');
    }

    return result.rows[0];
  },

  /**
   * Delete livestock record
   */
  async delete(id, farmer_id) {
    const result = await pool.query(
      `DELETE FROM livestock WHERE id = $1 AND farmer_id = $2 RETURNING id`,
      [id, farmer_id]
    );

    if (result.rows.length === 0) {
      throw new Error('Livestock not found or unauthorized');
    }

    return { deleted: true, id };
  },

  /**
   * Add an event to livestock
   */
  async addEvent({ livestock_id, event_type, description, event_date, recorded_by }) {
    // Verify livestock exists
    const livestock = await this.findById(livestock_id);
    if (!livestock) {
      throw new Error('Livestock not found');
    }

    const result = await pool.query(
      `INSERT INTO livestock_events (livestock_id, event_type, description, event_date, recorded_by, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [livestock_id, event_type, description, event_date || new Date(), recorded_by]
    );

    // If event is death or sale, update livestock status
    if (event_type === 'death') {
      await pool.query(
        `UPDATE livestock SET status = 'deceased', updated_at = NOW() WHERE id = $1`,
        [livestock_id]
      );
    } else if (event_type === 'sale') {
      await pool.query(
        `UPDATE livestock SET status = 'sold', updated_at = NOW() WHERE id = $1`,
        [livestock_id]
      );
    } else if (event_type === 'illness') {
      await pool.query(
        `UPDATE livestock SET status = 'sick', updated_at = NOW() WHERE id = $1`,
        [livestock_id]
      );
    } else if (event_type === 'treatment' && livestock.status === 'sick') {
      await pool.query(
        `UPDATE livestock SET status = 'healthy', updated_at = NOW() WHERE id = $1`,
        [livestock_id]
      );
    }

    // If it's a weight update, also update the weight on livestock
    if (event_type === 'weight_update' && description) {
      const weightMatch = description.match(/(\d+(?:\.\d+)?)\s*kg/i);
      if (weightMatch) {
        await pool.query(
          `UPDATE livestock SET weight_kg = $1, updated_at = NOW() WHERE id = $2`,
          [parseFloat(weightMatch[1]), livestock_id]
        );
      }
    }

    return result.rows[0];
  },

  /**
   * Get events for a livestock
   */
  async getEvents(livestock_id, { limit = 50 } = {}) {
    const result = await pool.query(
      `SELECT le.*, u.name as recorded_by_name
       FROM livestock_events le
       LEFT JOIN users u ON le.recorded_by = u.id
       WHERE le.livestock_id = $1
       ORDER BY le.event_date DESC, le.created_at DESC
       LIMIT $2`,
      [livestock_id, limit]
    );
    return result.rows;
  },

  /**
   * Get summary statistics for a farmer's livestock
   */
  async getSummaryStats(farmer_id) {
    const result = await pool.query(
      `SELECT 
        type,
        status,
        COUNT(*) as count
       FROM livestock
       WHERE farmer_id = $1
       GROUP BY type, status
       ORDER BY type, status`,
      [farmer_id]
    );

    // Process into structured summary
    const byType = {};
    const byStatus = { healthy: 0, sick: 0, sold: 0, deceased: 0 };
    let total = 0;

    for (const row of result.rows) {
      const count = parseInt(row.count);
      total += count;
      
      // By type
      if (!byType[row.type]) {
        byType[row.type] = { total: 0, healthy: 0, sick: 0, sold: 0, deceased: 0 };
      }
      byType[row.type][row.status] = count;
      byType[row.type].total += count;

      // By status
      byStatus[row.status] += count;
    }

    return {
      total,
      byType,
      byStatus
    };
  },

  /**
   * Check if farmer owns a livestock
   */
  async isOwner(livestock_id, farmer_id) {
    const result = await pool.query(
      `SELECT id FROM livestock WHERE id = $1 AND farmer_id = $2`,
      [livestock_id, farmer_id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Livestock;
