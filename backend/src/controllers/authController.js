/**
 * Auth Controller for AgriConnect
 * Handles user registration, login, and profile management
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

      // Check if phone already exists
      const existingUser = await User.findByPhone(phone);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered'
        });
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Email already registered'
          });
        }
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password,
        role: role === 'admin' ? 'farmer' : role, // Prevent self-registering as admin
        region_id
      });

      // Generate token
      const token = generateToken(user.id, user.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            region_id: user.region_id
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
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

      // Find user by phone
      const user = await User.findByPhone(phone);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password'
        });
      }

      // Check if account is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Account is suspended. Please contact support.'
        });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
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
            region_id: user.region_id
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
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
        const existing = await User.findByPhone(phone);
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'Phone number already in use'
          });
        }
      }

      // Check if new email is already taken
      if (email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail && existingEmail.id !== req.user.id) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }

      const updatedUser = await User.update(req.user.id, {
        name,
        email,
        phone,
        region_id
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findByPhone(req.user.phone);

      // Verify current password
      const isValid = await User.verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      await User.updatePassword(req.user.id, newPassword);

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
