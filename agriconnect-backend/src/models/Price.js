/**
 * Price Model for AgriConnect
 * Handles market price data operations
 */
const { query } = require('../config/db');

const Price = {
  // Create or update price for crop in region
  async upsert({ crop_id, region_id, price, unit = 'kg', updated_by }) {
    const result = await query(
      `INSERT INTO prices (crop_id, region_id, price, unit, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (crop_id, region_id)
       DO UPDATE SET 
         price = EXCLUDED.price,
         unit = EXCLUDED.unit,
         previous_price = prices.price,
         updated_by = EXCLUDED.updated_by,
         updated_at = NOW()
       RETURNING *`,
      [crop_id, region_id, price, unit, updated_by]
    );
    
    return result.rows[0];
  },

  // Get all current prices
  async findAll({ crop_id, region_id, page = 1, limit = 50 }) {
    let whereClause = [];
    let values = [];
    let paramCount = 1;

    if (crop_id) {
      whereClause.push(`p.crop_id = $${paramCount}`);
      values.push(crop_id);
      paramCount++;
    }

    if (region_id) {
      whereClause.push(`p.region_id = $${paramCount}`);
      values.push(region_id);
      paramCount++;
    }

    const where = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await query(
      `SELECT p.*, 
              c.name as crop_name, c.category as crop_category,
              r.name as region_name,
              CASE 
                WHEN p.previous_price IS NOT NULL AND p.previous_price > 0 
                THEN ROUND(((p.price - p.previous_price) / p.previous_price * 100)::numeric, 2)
                ELSE 0 
              END as price_change_percent
       FROM prices p
       JOIN crops c ON p.crop_id = c.id
       JOIN regions r ON p.region_id = r.id
       ${where}
       ORDER BY c.name, r.name
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM prices p ${where}`,
      values.slice(0, -2)
    );

    return {
      prices: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Get price for specific crop and region
  async findByCropAndRegion(crop_id, region_id) {
    const result = await query(
      `SELECT p.*, 
              c.name as crop_name,
              r.name as region_name
       FROM prices p
       JOIN crops c ON p.crop_id = c.id
       JOIN regions r ON p.region_id = r.id
       WHERE p.crop_id = $1 AND p.region_id = $2`,
      [crop_id, region_id]
    );
    return result.rows[0];
  },

  // Get latest prices by crop (across all regions)
  async findByCrop(crop_id) {
    const result = await query(
      `SELECT p.*, r.name as region_name
       FROM prices p
       JOIN regions r ON p.region_id = r.id
       WHERE p.crop_id = $1
       ORDER BY r.name`,
      [crop_id]
    );
    return result.rows;
  },

  // Get latest prices for a region
  async findByRegion(region_id) {
    const result = await query(
      `SELECT p.*, c.name as crop_name, c.category
       FROM prices p
       JOIN crops c ON p.crop_id = c.id
       WHERE p.region_id = $1
       ORDER BY c.category, c.name`,
      [region_id]
    );
    return result.rows;
  },

  // Delete price record
  async delete(crop_id, region_id) {
    const result = await query(
      'DELETE FROM prices WHERE crop_id = $1 AND region_id = $2 RETURNING *',
      [crop_id, region_id]
    );
    return result.rows[0];
  },

  // Get price history (for future implementation of price trends)
  async getHistory(crop_id, region_id, days = 30) {
    const result = await query(
      `SELECT * FROM price_history
       WHERE crop_id = $1 AND region_id = $2 
       AND recorded_at >= NOW() - INTERVAL '${days} days'
       ORDER BY recorded_at DESC`,
      [crop_id, region_id]
    );
    return result.rows;
  }
};

module.exports = Price;
