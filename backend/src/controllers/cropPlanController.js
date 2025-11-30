/**
 * CropPlan Controller for AgriConnect
 * Handles crop planning operations
 */
const CropPlan = require('../models/CropPlan');

const cropPlanController = {
  // Create or update a crop plan
  async upsert(req, res) {
    try {
      const { crop_id, season, year, planned_quantity, notes } = req.body;

      const plan = await CropPlan.upsert({
        farmer_id: req.user.id,
        crop_id,
        season,
        year,
        planned_quantity,
        notes
      });

      res.json({
        success: true,
        message: 'Crop plan saved successfully',
        data: plan
      });
    } catch (error) {
      console.error('Create crop plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save crop plan'
      });
    }
  },

  // Get farmer's crop plans
  async getMyPlans(req, res) {
    try {
      const { season, year } = req.query;

      const plans = await CropPlan.findByFarmer(req.user.id, {
        season,
        year: year ? parseInt(year) : null
      });

      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      console.error('Get my plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch crop plans'
      });
    }
  },

  // Delete a crop plan
  async delete(req, res) {
    try {
      const deleted = await CropPlan.delete(req.params.id, req.user.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Crop plan not found or not authorized'
        });
      }

      res.json({
        success: true,
        message: 'Crop plan deleted successfully'
      });
    } catch (error) {
      console.error('Delete crop plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete crop plan'
      });
    }
  },

  // Get regional crop trends
  async getRegionalTrends(req, res) {
    try {
      const { season, year } = req.query;
      const region_id = req.params.region_id || req.user?.region_id;

      if (!region_id) {
        return res.status(400).json({
          success: false,
          message: 'Region ID is required'
        });
      }

      const trends = await CropPlan.getRegionalTrends(parseInt(region_id), {
        season,
        year: year ? parseInt(year) : null
      });

      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      console.error('Get regional trends error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch regional trends'
      });
    }
  },

  // Get national crop trends
  async getNationalTrends(req, res) {
    try {
      const { season, year } = req.query;

      const trends = await CropPlan.getNationalTrends({
        season,
        year: year ? parseInt(year) : null
      });

      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      console.error('Get national trends error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch national trends'
      });
    }
  },

  // Get planning summary for dashboard
  async getSummary(req, res) {
    try {
      const summary = await CropPlan.getSummary(req.user.id);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch planning summary'
      });
    }
  }
};

module.exports = cropPlanController;
