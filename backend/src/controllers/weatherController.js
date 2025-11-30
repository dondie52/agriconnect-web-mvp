/**
 * Weather Controller for AgriConnect
 * Handles weather data from OpenWeather API
 */
const weatherService = require('../services/weatherService');
const { Region } = require('../models/CropRegion');

const weatherController = {
  // Get weather for user's region
  async getForUser(req, res) {
    try {
      if (!req.user.region_id) {
        return res.status(400).json({
          success: false,
          message: 'Please set your region to view weather data'
        });
      }

      const region = await Region.findById(req.user.region_id);
      if (!region) {
        return res.status(404).json({
          success: false,
          message: 'Region not found'
        });
      }

      const weather = await weatherService.getWeather(
        region.latitude || -24.6282, // Default to Gaborone if no coords
        region.longitude || 25.9231,
        region.name
      );

      res.json({
        success: true,
        data: weather
      });
    } catch (error) {
      console.error('Get weather error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather data'
      });
    }
  },

  // Get weather for specific region
  async getByRegion(req, res) {
    try {
      const region = await Region.findById(req.params.region_id);
      
      if (!region) {
        return res.status(404).json({
          success: false,
          message: 'Region not found'
        });
      }

      const weather = await weatherService.getWeather(
        region.latitude || -24.6282,
        region.longitude || 25.9231,
        region.name
      );

      res.json({
        success: true,
        data: weather
      });
    } catch (error) {
      console.error('Get weather by region error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather data'
      });
    }
  },

  // Get weather forecast (7 days)
  async getForecast(req, res) {
    try {
      const region_id = req.params.region_id || req.user?.region_id;
      
      if (!region_id) {
        return res.status(400).json({
          success: false,
          message: 'Region ID is required'
        });
      }

      const region = await Region.findById(region_id);
      
      if (!region) {
        return res.status(404).json({
          success: false,
          message: 'Region not found'
        });
      }

      const forecast = await weatherService.getForecast(
        region.latitude || -24.6282,
        region.longitude || 25.9231,
        region.name
      );

      res.json({
        success: true,
        data: forecast
      });
    } catch (error) {
      console.error('Get forecast error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch forecast data'
      });
    }
  },

  // Get weather alerts
  async getAlerts(req, res) {
    try {
      const region_id = req.params.region_id || req.user?.region_id;
      
      if (!region_id) {
        return res.status(400).json({
          success: false,
          message: 'Region ID is required'
        });
      }

      const region = await Region.findById(region_id);
      
      if (!region) {
        return res.status(404).json({
          success: false,
          message: 'Region not found'
        });
      }

      const alerts = await weatherService.getAlerts(
        region.latitude || -24.6282,
        region.longitude || 25.9231
      );

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Get alerts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather alerts'
      });
    }
  }
};

module.exports = weatherController;
