/**
 * Auth Controller for AgriConnect
 * Handles user registration, login, and profile management
 * Uses direct Supabase PostgreSQL queries
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const { name, email, phone, password, role = 'farmer', region_id } = req.body;

      // Validate required fields
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      if (!phone || !phone.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      if (!role || !['farmer', 'buyer'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be either farmer or buyer'
        });
      }

      // Check if phone already exists
      const existingPhone = await pool.query(
        'SELECT id FROM users WHERE phone = $1 LIMIT 1',
        [phone]
      );
      
      if (existingPhone.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await pool.query(
          'SELECT id FROM users WHERE email = $1 LIMIT 1',
          [email]
        );
        
        if (existingEmail.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'User already exists'
          });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Sanitize role - prevent self-registering as admin
      const safeRole = role === 'admin' ? 'farmer' : role;

      // Insert into Supabase
      const result = await pool.query(
        `INSERT INTO users (name, email, phone, password, role, region_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, email, phone, role, region_id`,
        [name.trim(), email || null, phone.trim(), hashedPassword, safeRole, region_id || null]
      );

      const user = result.rows[0];

      // Generate token
      const token = generateToken(user.id, user.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          region_id: user.region_id
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
      
      // Handle Supabase connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return res.status(503).json({
          success: false,
          message: 'Database connection failed. Please try again later.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { phone, password } = req.body;

      // Validate required fields
      if (!phone || !phone.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required'
        });
      }

      // Query Supabase for user
      const result = await pool.query(
        'SELECT * FROM users WHERE phone = $1 LIMIT 1',
        [phone.trim()]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password'
        });
      }

      // Check if account is active
      if (user.is_active === false) {
        return res.status(401).json({
          success: false,
          message: 'Account is suspended. Please contact support.'
        });
      }

      // Compare hashed password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password'
        });
      }

      // Generate token
      const token = generateToken(user.id, user.role);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            region_id: user.region_id,
            profile_photo: user.profile_photo
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle Supabase connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return res.status(503).json({
          success: false,
          message: 'Database connection failed. Supabase may be unreachable. Please try again later.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.phone, u.role, u.region_id, 
                r.name as region_name, u.profile_photo, u.is_active, u.created_at
         FROM users u 
         LEFT JOIN regions r ON u.region_id = r.id 
         WHERE u.id = $1`,
        [req.user.id]
      );
      
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          region_id: user.region_id,
          region_name: user.region_name,
          profile_photo: user.profile_photo,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, email, phone, region_id } = req.body;

      // Check if new phone is already taken
      if (phone && phone !== req.user.phone) {
        const existing = await pool.query(
          'SELECT id FROM users WHERE phone = $1 AND id != $2',
          [phone, req.user.id]
        );
        if (existing.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Phone number already in use'
          });
        }
      }

      // Check if new email is already taken
      if (email) {
        const existingEmail = await pool.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [email, req.user.id]
        );
        if (existingEmail.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }

      // Build update query dynamically
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }
      if (email !== undefined) {
        updates.push(`email = $${paramCount}`);
        values.push(email || null);
        paramCount++;
      }
      if (phone !== undefined) {
        updates.push(`phone = $${paramCount}`);
        values.push(phone);
        paramCount++;
      }
      if (region_id !== undefined) {
        updates.push(`region_id = $${paramCount}`);
        values.push(region_id || null);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(req.user.id);

      const result = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
         RETURNING id, name, email, phone, role, region_id, is_active, created_at, updated_at`,
        values
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  },

  // Upload profile photo
  async uploadProfilePhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const photoUrl = `/uploads/${req.file.filename}`;

      // Update user's profile photo
      const result = await pool.query(
        `UPDATE users SET profile_photo = $1, updated_at = NOW() 
         WHERE id = $2
         RETURNING id, name, email, phone, role, region_id, profile_photo, is_active, created_at`,
        [photoUrl, req.user.id]
      );

      res.json({
        success: true,
        message: 'Profile photo updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Upload profile photo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile photo'
      });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const userResult = await pool.query(
        'SELECT password FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await pool.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, req.user.id]
      );

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }
};

module.exports = authController;
