/**
 * Crop Model for AgriConnect
 * Handles crop/produce category data
 */
const { query } = require('../config/db');

const Crop = {
  // Get all crops
  async findAll() {
    const result = await query(
      'SELECT * FROM crops ORDER BY category, name'
    );
    return result.rows;
  },

  // Get crop by ID
  async findById(id) {
    const result = await query(
      'SELECT * FROM crops WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Get crops by category
  async findByCategory(category) {
    const result = await query(
      'SELECT * FROM crops WHERE category = $1 ORDER BY name',
      [category]
    );
    return result.rows;
  },

  // Create crop (admin)
  async create({ name, category, description }) {
    const result = await query(
      `INSERT INTO crops (name, category, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, category, description]
    );
    return result.rows[0];
  },

  // Update crop (admin)
  async update(id, { name, category, description }) {
    const result = await query(
      `UPDATE crops SET name = COALESCE($1, name), 
                        category = COALESCE($2, category),
                        description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *`,
      [name, category, description, id]
    );
    return result.rows[0];
  },

  // Get categories
  async getCategories() {
    const result = await query(
      'SELECT DISTINCT category FROM crops ORDER BY category'
    );
    return result.rows.map(r => r.category);
  }
};

/**
 * Region Model for AgriConnect
 * Handles geographic regions (districts of Botswana)
 */
const Region = {
  // Get all regions
  async findAll() {
    const result = await query(
      'SELECT * FROM regions ORDER BY name'
    );
    return result.rows;
  },

  // Get region by ID
  async findById(id) {
    const result = await query(
      'SELECT * FROM regions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Create region (admin)
  async create({ name, latitude, longitude }) {
    const result = await query(
      `INSERT INTO regions (name, latitude, longitude)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, latitude, longitude]
    );
    return result.rows[0];
  },

  // Update region (admin)
  async update(id, { name, latitude, longitude }) {
    const result = await query(
      `UPDATE regions SET name = COALESCE($1, name),
                          latitude = COALESCE($2, latitude),
                          longitude = COALESCE($3, longitude)
       WHERE id = $4
       RETURNING *`,
      [name, latitude, longitude, id]
    );
    return result.rows[0];
  }
};

module.exports = { Crop, Region };
