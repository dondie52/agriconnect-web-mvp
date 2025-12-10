/**
 * CropPlan Model for AgriConnect
 * Handles crop planning data for farmers
 */
const { pool } = require('../config/db');

const CropPlan = {
  // Create or update a crop plan
  async upsert({ farmer_id, crop_id, season, year, planned_quantity, notes }) {
    const currentYear = year || new Date().getFullYear();
    
    const result = await pool.query(
      `INSERT INTO crop_plans (farmer_id, crop_id, season, year, planned_quantity, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (farmer_id, crop_id, season, year)
       DO UPDATE SET 
         planned_quantity = EXCLUDED.planned_quantity,
         notes = EXCLUDED.notes,
         updated_at = NOW()
       RETURNING *`,
      [farmer_id, crop_id, season, currentYear, planned_quantity, notes]
    );
    
    return result.rows[0];
  },

  // Get farmer's crop plans
  async findByFarmer(farmer_id, { season, year }) {
    let whereClause = ['cp.farmer_id = $1'];
    let values = [farmer_id];
    let paramCount = 2;

    if (season) {
      whereClause.push(`cp.season = $${paramCount}`);
      values.push(season);
      paramCount++;
    }

    if (year) {
      whereClause.push(`cp.year = $${paramCount}`);
      values.push(year);
      paramCount++;
    }

    const result = await pool.query(
      `SELECT cp.*, c.name as crop_name, c.category as crop_category
       FROM crop_plans cp
       JOIN crops c ON cp.crop_id = c.id
       WHERE ${whereClause.join(' AND ')}
       ORDER BY cp.year DESC, cp.season, c.name`,
      values
    );

    return result.rows;
  },

  // Delete a crop plan
  async delete(id, farmer_id) {
    const result = await pool.query(
      'DELETE FROM crop_plans WHERE id = $1 AND farmer_id = $2 RETURNING id',
      [id, farmer_id]
    );
    return result.rows[0];
  },

  // Get regional crop trends (what farmers in a region are planning)
  async getRegionalTrends(region_id, { season, year }) {
    const currentYear = year || new Date().getFullYear();
    const currentSeason = season || getCurrentSeason();

    const result = await pool.query(
      `SELECT c.id as crop_id, c.name as crop_name, c.category,
              COUNT(cp.id) as farmer_count,
              COALESCE(SUM(cp.planned_quantity), 0) as total_planned_quantity
       FROM crop_plans cp
       JOIN crops c ON cp.crop_id = c.id
       JOIN users u ON cp.farmer_id = u.id
       WHERE u.region_id = $1 AND cp.season = $2 AND cp.year = $3
       GROUP BY c.id, c.name, c.category
       ORDER BY farmer_count DESC, total_planned_quantity DESC`,
      [region_id, currentSeason, currentYear]
    );

    return result.rows;
  },

  // Get national crop trends
  async getNationalTrends({ season, year }) {
    const currentYear = year || new Date().getFullYear();
    const currentSeason = season || getCurrentSeason();

    const result = await pool.query(
      `SELECT c.id as crop_id, c.name as crop_name, c.category,
              r.id as region_id, r.name as region_name,
              COUNT(cp.id) as farmer_count,
              COALESCE(SUM(cp.planned_quantity), 0) as total_planned_quantity
       FROM crop_plans cp
       JOIN crops c ON cp.crop_id = c.id
       JOIN users u ON cp.farmer_id = u.id
       JOIN regions r ON u.region_id = r.id
       WHERE cp.season = $1 AND cp.year = $2
       GROUP BY c.id, c.name, c.category, r.id, r.name
       ORDER BY r.name, farmer_count DESC`,
      [currentSeason, currentYear]
    );

    return result.rows;
  },

  // Get planning summary for dashboard
  async getSummary(farmer_id) {
    const currentYear = new Date().getFullYear();
    
    const result = await pool.query(
      `SELECT season, COUNT(*) as crop_count, 
              COALESCE(SUM(planned_quantity), 0) as total_quantity
       FROM crop_plans
       WHERE farmer_id = $1 AND year = $2
       GROUP BY season`,
      [farmer_id, currentYear]
    );

    return result.rows;
  }
};

// Helper function to determine current season based on Botswana climate
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 10 || month <= 3) return 'summer'; // Oct-Mar (rainy season)
  if (month >= 4 && month <= 6) return 'autumn';
  if (month >= 7 && month <= 9) return 'winter';
  return 'summer';
}

module.exports = CropPlan;
