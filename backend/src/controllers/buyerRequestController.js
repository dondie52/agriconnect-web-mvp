/**
 * BuyerRequest Controller for AgriConnect
 * Handles buyer produce requests
 */
const BuyerRequest = require('../models/BuyerRequest');
const Notification = require('../models/Notification');
const { query } = require('../config/db');

const buyerRequestController = {
  // Create a new buyer request
  async create(req, res) {
    try {
      const { crop_id, quantity, unit, max_price, region_id, notes } = req.body;

      const request = await BuyerRequest.create({
        buyer_id: req.user.id,
        crop_id,
        quantity,
        unit,
        max_price,
        region_id,
        notes
      });

      // Get full request details
      const fullRequest = await BuyerRequest.findById(request.id);

      // Notify relevant farmers (those who have active listings of this crop in the region)
      const farmersResult = await query(
        `SELECT DISTINCT l.farmer_id 
         FROM listings l
         WHERE l.crop_id = $1 
         AND l.status = 'active'
         AND ($2::int IS NULL OR l.region_id = $2)
         LIMIT 50`,
        [crop_id, region_id]
      );

      if (farmersResult.rows.length > 0) {
        const farmerIds = farmersResult.rows.map(r => r.farmer_id);
        await Notification.notifyFarmersNewRequest(
          farmerIds,
          request.id,
          fullRequest.crop_name,
          quantity
        );
      }

      res.status(201).json({
        success: true,
        message: 'Request posted successfully',
        data: fullRequest
      });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create request'
      });
    }
  },

  // Get all open requests (for farmers)
  async getAll(req, res) {
    try {
      const { crop_id, region_id, status = 'open', page = 1, limit = 10 } = req.query;

      const result = await BuyerRequest.findAll({
        crop_id: crop_id ? parseInt(crop_id) : null,
        region_id: region_id ? parseInt(region_id) : null,
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch requests'
      });
    }
  },

  // Get request by ID
  async getById(req, res) {
    try {
      const request = await BuyerRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      res.json({
        success: true,
        data: request
      });
    } catch (error) {
      console.error('Get request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch request'
      });
    }
  },

  // Update request (buyer only)
  async update(req, res) {
    try {
      const request = await BuyerRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      // Check ownership
      if (request.buyer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this request'
        });
      }

      const { crop_id, quantity, unit, max_price, region_id, notes } = req.body;

      const updatedRequest = await BuyerRequest.update(req.params.id, {
        crop_id,
        quantity,
        unit,
        max_price,
        region_id,
        notes
      });

      const fullRequest = await BuyerRequest.findById(updatedRequest.id);

      res.json({
        success: true,
        message: 'Request updated successfully',
        data: fullRequest
      });
    } catch (error) {
      console.error('Update request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update request'
      });
    }
  },

  // Delete request (buyer only)
  async delete(req, res) {
    try {
      const request = await BuyerRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      // Check ownership
      if (request.buyer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this request'
        });
      }

      await BuyerRequest.delete(req.params.id);

      res.json({
        success: true,
        message: 'Request deleted successfully'
      });
    } catch (error) {
      console.error('Delete request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete request'
      });
    }
  },

  // Get buyer's own requests
  async getMyRequests(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const result = await BuyerRequest.findByBuyer(req.user.id, {
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get my requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch requests'
      });
    }
  },

  // Get relevant requests for a farmer
  async getRelevantForFarmer(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await BuyerRequest.findRelevantForFarmer(req.user.id, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get relevant requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch requests'
      });
    }
  },

  // Close a request
  async close(req, res) {
    try {
      const closed = await BuyerRequest.close(req.params.id, req.user.id);

      if (!closed) {
        return res.status(404).json({
          success: false,
          message: 'Request not found or not authorized'
        });
      }

      res.json({
        success: true,
        message: 'Request closed successfully'
      });
    } catch (error) {
      console.error('Close request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to close request'
      });
    }
  }
};

module.exports = buyerRequestController;
