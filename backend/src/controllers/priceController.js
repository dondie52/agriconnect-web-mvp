/**
 * Price Controller for AgriConnect
 * Handles market price operations
 */
const Price = require('../models/Price');

const priceController = {
  // Get all prices (public)
  async getAll(req, res) {
    try {
      const { crop_id, region_id, page = 1, limit = 50 } = req.query;

      const result = await Price.findAll({
        crop_id: crop_id ? parseInt(crop_id) : null,
        region_id: region_id ? parseInt(region_id) : null,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get prices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch prices'
      });
    }
  },

  // Get price for specific crop and region
  async getByCropAndRegion(req, res) {
    try {
      const { crop_id, region_id } = req.params;

      const price = await Price.findByCropAndRegion(
        parseInt(crop_id),
        parseInt(region_id)
      );

      if (!price) {
        return res.status(404).json({
          success: false,
          message: 'Price not found for this crop and region'
        });
      }

      res.json({
        success: true,
        data: price
      });
    } catch (error) {
      console.error('Get price error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch price'
      });
    }
  },

  // Get prices for a specific crop (across all regions)
  async getByCrop(req, res) {
    try {
      const prices = await Price.findByCrop(parseInt(req.params.crop_id));

      res.json({
        success: true,
        data: prices
      });
    } catch (error) {
      console.error('Get crop prices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch prices'
      });
    }
  },

  // Get prices for a specific region
  async getByRegion(req, res) {
    try {
      const prices = await Price.findByRegion(parseInt(req.params.region_id));

      res.json({
        success: true,
        data: prices
      });
    } catch (error) {
      console.error('Get region prices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch prices'
      });
    }
  },

  // Create or update price (admin only)
  async upsert(req, res) {
    try {
      const { crop_id, region_id, price, unit } = req.body;

      const priceRecord = await Price.upsert({
        crop_id,
        region_id,
        price,
        unit,
        updated_by: req.user.id
      });

      res.json({
        success: true,
        message: 'Price updated successfully',
        data: priceRecord
      });
    } catch (error) {
      console.error('Update price error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update price'
      });
    }
  },

  // Bulk update prices (admin only)
  async bulkUpsert(req, res) {
    try {
      const { prices } = req.body;

      if (!Array.isArray(prices) || prices.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Prices array is required'
        });
      }

      const results = await Promise.all(
        prices.map(p => 
          Price.upsert({
            crop_id: p.crop_id,
            region_id: p.region_id,
            price: p.price,
            unit: p.unit,
            updated_by: req.user.id
          })
        )
      );

      res.json({
        success: true,
        message: `${results.length} prices updated successfully`,
        data: results
      });
    } catch (error) {
      console.error('Bulk update prices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update prices'
      });
    }
  },

  // Delete price (admin only)
  async delete(req, res) {
    try {
      const { crop_id, region_id } = req.params;

      const deleted = await Price.delete(
        parseInt(crop_id),
        parseInt(region_id)
      );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Price not found'
        });
      }

      res.json({
        success: true,
        message: 'Price deleted successfully'
      });
    } catch (error) {
      console.error('Delete price error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete price'
      });
    }
  }
};

module.exports = priceController;
