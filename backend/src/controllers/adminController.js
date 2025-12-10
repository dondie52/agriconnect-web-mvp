/**
 * Admin Controller for AgriConnect
 * Handles admin-specific operations
 */
const User = require('../models/User');
const { Crop, Region } = require('../models/CropRegion');
const Analytics = require('../models/Analytics');
const { pool } = require('../config/db');

const adminController = {
  // Get all users with filters
  async getUsers(req, res) {
    try {
      const { role, is_active, page = 1, limit = 20 } = req.query;

      const isActiveBool = is_active === 'true' ? true : is_active === 'false' ? false : undefined;

      const result = await User.findAll({
        role,
        is_active: isActiveBool,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove password from response
      delete user.password;

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }
  },

  // Toggle user active status
  async toggleUserStatus(req, res) {
    try {
      const result = await User.toggleActive(req.params.id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: `User ${result.is_active ? 'activated' : 'suspended'} successfully`,
        data: result
      });
    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status'
      });
    }
  },

  // Update user role
  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      const allowedRoles = ['farmer', 'buyer', 'admin'];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
      }

      const result = await pool.query(
        `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, role`,
        [role, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user role'
      });
    }
  },

  // Get dashboard overview
  async getDashboard(req, res) {
    try {
      const overview = await Analytics.getPlatformOverview();
      const userCounts = await User.countByRole();

      res.json({
        success: true,
        data: {
          ...overview,
          user_counts: userCounts
        }
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  },

  // Get all crops
  async getCrops(req, res) {
    try {
      const crops = await Crop.findAll();

      res.json({
        success: true,
        data: crops
      });
    } catch (error) {
      console.error('Get crops error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch crops'
      });
    }
  },

  // Create crop
  async createCrop(req, res) {
    try {
      const { name, category, description } = req.body;

      const crop = await Crop.create({ name, category, description });

      res.status(201).json({
        success: true,
        message: 'Crop created successfully',
        data: crop
      });
    } catch (error) {
      console.error('Create crop error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create crop'
      });
    }
  },

  // Update crop
  async updateCrop(req, res) {
    try {
      const { name, category, description } = req.body;

      const crop = await Crop.update(req.params.id, { name, category, description });

      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      res.json({
        success: true,
        message: 'Crop updated successfully',
        data: crop
      });
    } catch (error) {
      console.error('Update crop error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update crop'
      });
    }
  },

  // Get all regions
  async getRegions(req, res) {
    try {
      const regions = await Region.findAll();

      res.json({
        success: true,
        data: regions
      });
    } catch (error) {
      console.error('Get regions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch regions'
      });
    }
  },

  // Create region
  async createRegion(req, res) {
    try {
      const { name, latitude, longitude } = req.body;

      const region = await Region.create({ name, latitude, longitude });

      res.status(201).json({
        success: true,
        message: 'Region created successfully',
        data: region
      });
    } catch (error) {
      console.error('Create region error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create region'
      });
    }
  },

  // Update region
  async updateRegion(req, res) {
    try {
      const { name, latitude, longitude } = req.body;

      const region = await Region.update(req.params.id, { name, latitude, longitude });

      if (!region) {
        return res.status(404).json({
          success: false,
          message: 'Region not found'
        });
      }

      res.json({
        success: true,
        message: 'Region updated successfully',
        data: region
      });
    } catch (error) {
      console.error('Update region error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update region'
      });
    }
  },

  // Get all listings (admin view)
  async getListings(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      let whereClause = [];
      let values = [];
      let paramCount = 1;

      if (status) {
        whereClause.push(`l.status = $${paramCount}`);
        values.push(status);
        paramCount++;
      }

      const where = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
      const offset = (parseInt(page) - 1) * parseInt(limit);
      values.push(parseInt(limit), offset);

      const result = await pool.query(
        `SELECT l.*, 
                c.name as crop_name,
                r.name as region_name,
                u.name as farmer_name, u.phone as farmer_phone
         FROM listings l
         JOIN crops c ON l.crop_id = c.id
         JOIN regions r ON l.region_id = r.id
         JOIN users u ON l.farmer_id = u.id
         ${where}
         ORDER BY l.created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
        values
      );

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM listings l ${where}`,
        values.slice(0, -2)
      );

      res.json({
        success: true,
        data: {
          listings: result.rows,
          total: parseInt(countResult.rows[0].count),
          page: parseInt(page),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get admin listings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch listings'
      });
    }
  }
};

module.exports = adminController;
