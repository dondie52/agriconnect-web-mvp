/**
 * Price Controller for AgriConnect
 * Handles market price operations
 */
const Price = require('../models/Price');
const priceCache = require('../services/priceCache');
const { getSyncStatus, syncMarketPrices } = require('../services/marketPriceSyncService');

const priceController = {
  // Get latest prices with caching (public) - optimized endpoint
  async getLatest(req, res) {
    try {
      const { crop, region, crop_id, region_id } = req.query;
      
      const params = { crop, region, crop_id, region_id };
      
      // Check cache first
      const cached = priceCache.get(params);
      if (cached) {
        return res.json({
          success: true,
          data: cached.data,
          cached: true,
          cachedAt: cached.cachedAt,
          lastSync: cached.lastSync
        });
      }
      
      // Build query with filters
      let whereClause = [];
      let values = [];
      let paramCount = 1;
      
      if (crop) {
        whereClause.push(`LOWER(c.name) LIKE LOWER($${paramCount})`);
        values.push(`%${crop}%`);
        paramCount++;
      }
      
      if (region) {
        whereClause.push(`LOWER(r.name) LIKE LOWER($${paramCount})`);
        values.push(`%${region}%`);
        paramCount++;
      }
      
      if (crop_id) {
        whereClause.push(`p.crop_id = $${paramCount}`);
        values.push(parseInt(crop_id));
        paramCount++;
      }
      
      if (region_id) {
        whereClause.push(`p.region_id = $${paramCount}`);
        values.push(parseInt(region_id));
        paramCount++;
      }
      
      const where = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
      
      const { pool } = require('../config/db');
      const result = await pool.query(
        `SELECT 
          p.id,
          c.name as crop,
          r.name as region,
          p.price,
          p.unit,
          p.previous_price,
          p.updated_at,
          CASE 
            WHEN p.previous_price IS NOT NULL AND p.previous_price > 0 
            THEN CONCAT(
              CASE WHEN (p.price - p.previous_price) >= 0 THEN '+' ELSE '' END,
              ROUND(((p.price - p.previous_price) / p.previous_price * 100)::numeric, 1),
              '%'
            )
            ELSE '0%'
          END as change,
          c.category as crop_category
        FROM prices p
        JOIN crops c ON p.crop_id = c.id
        JOIN regions r ON p.region_id = r.id
        ${where}
        ORDER BY c.category, c.name, r.name`,
        values
      );
      
      const data = result.rows;
      const syncStatus = getSyncStatus();
      
      // Store in cache
      priceCache.set(params, data);
      
      res.json({
        success: true,
        data,
        cached: false,
        lastSync: syncStatus.lastSync
      });
    } catch (error) {
      console.error('Get latest prices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch latest prices'
      });
    }
  },

  // Trigger manual sync (admin only)
  async triggerSync(req, res) {
    try {
      const stats = await syncMarketPrices();
      res.json({
        success: true,
        message: 'Price sync completed',
        data: stats
      });
    } catch (error) {
      console.error('Trigger sync error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to sync prices'
      });
    }
  },

  // Get sync status
  async getSyncStatus(req, res) {
    try {
      const status = getSyncStatus();
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Get sync status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sync status'
      });
    }
  },

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
