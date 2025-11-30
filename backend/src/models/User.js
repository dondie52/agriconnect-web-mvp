/**
 * User Model for AgriConnect
 * Handles user data operations
 */
const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  async create({ name, email, phone, password, role = 'farmer', region_id = null }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await query(
      `INSERT INTO users (name, email, phone, password, role, region_id, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
       RETURNING id, name, email, phone, role, region_id, is_active, created_at`,
      [name, email || null, phone, hashedPassword, role, region_id]
    );
    
    return result.rows[0];
  },

  // Find user by phone number
  async findByPhone(phone) {
    const result = await query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const result = await query(
      `SELECT u.*, r.name as region_name 
       FROM users u 
       LEFT JOIN regions r ON u.region_id = r.id 
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Update user profile
  async update(id, updates) {
    const allowedFields = ['name', 'email', 'phone', 'region_id'];
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
      `UPDATE users SET ${setClause.join(', ')} WHERE id = $${paramCount}
       RETURNING id, name, email, phone, role, region_id, is_active, created_at, updated_at`,
      values
    );

    return result.rows[0];
  },

  // Update password
  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, id]
    );
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Get all users (admin)
  async findAll({ role, is_active, page = 1, limit = 20 }) {
    let whereClause = [];
    let values = [];
    let paramCount = 1;

    if (role) {
      whereClause.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    if (is_active !== undefined) {
      whereClause.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    const where = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
    const offset = (page - 1) * limit;

    values.push(limit, offset);

    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.region_id, r.name as region_name,
              u.is_active, u.created_at
       FROM users u
       LEFT JOIN regions r ON u.region_id = r.id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM users ${where}`,
      values.slice(0, -2)
    );

    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  },

  // Toggle user active status (admin)
  async toggleActive(id) {
    const result = await query(
      `UPDATE users SET is_active = NOT is_active, updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, is_active`,
      [id]
    );
    return result.rows[0];
  },

  // Count users by role
  async countByRole() {
    const result = await query(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    );
    return result.rows;
  }
};

module.exports = User;
