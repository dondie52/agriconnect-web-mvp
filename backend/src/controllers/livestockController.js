/**
 * Livestock Controller for AgriConnect
 * Handles livestock tracking API operations
 */
const Livestock = require('../models/Livestock');

const livestockController = {
  /**
   * Create a new livestock record
   * POST /api/livestock
   */
  async create(req, res) {
    try {
      const { type, breed, gender, age_months, weight_kg, tag_number, status, location, notes } = req.body;

      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'Livestock type is required'
        });
      }

      const validTypes = ['cattle', 'goat', 'sheep', 'chicken', 'pig', 'donkey', 'horse', 'other'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid livestock type. Must be one of: ${validTypes.join(', ')}`
        });
      }

      const livestock = await Livestock.create({
        farmer_id: req.user.id,
        type,
        breed,
        gender,
        age_months: age_months ? parseInt(age_months) : null,
        weight_kg: weight_kg ? parseFloat(weight_kg) : null,
        tag_number,
        status: status || 'healthy',
        location,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Livestock added successfully',
        data: livestock
      });
    } catch (error) {
      console.error('Create livestock error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create livestock record'
      });
    }
  },

  /**
   * Get farmer's livestock with filters
   * GET /api/livestock
   */
  async getAll(req, res) {
    try {
      const { type, status, search, page = 1, limit = 20 } = req.query;

      const result = await Livestock.findByFarmer(req.user.id, {
        type,
        status,
        search,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get livestock error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch livestock'
      });
    }
  },

  /**
   * Get livestock summary statistics
   * GET /api/livestock/summary
   */
  async getSummary(req, res) {
    try {
      const summary = await Livestock.getSummaryStats(req.user.id);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get livestock summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch livestock summary'
      });
    }
  },

  /**
   * Get single livestock by ID
   * GET /api/livestock/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const livestock = await Livestock.findById(parseInt(id));

      if (!livestock) {
        return res.status(404).json({
          success: false,
          message: 'Livestock not found'
        });
      }

      // Check ownership (unless admin)
      if (livestock.farmer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this livestock'
        });
      }

      res.json({
        success: true,
        data: livestock
      });
    } catch (error) {
      console.error('Get livestock by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch livestock'
      });
    }
  },

  /**
   * Update livestock record
   * PUT /api/livestock/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { type, breed, gender, age_months, weight_kg, tag_number, status, location, notes } = req.body;

      // Validate type if provided
      if (type) {
        const validTypes = ['cattle', 'goat', 'sheep', 'chicken', 'pig', 'donkey', 'horse', 'other'];
        if (!validTypes.includes(type)) {
          return res.status(400).json({
            success: false,
            message: `Invalid livestock type. Must be one of: ${validTypes.join(', ')}`
          });
        }
      }

      // Validate status if provided
      if (status) {
        const validStatuses = ['healthy', 'sick', 'sold', 'deceased'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
          });
        }
      }

      const livestock = await Livestock.update(parseInt(id), req.user.id, {
        type,
        breed,
        gender,
        age_months: age_months !== undefined ? parseInt(age_months) : undefined,
        weight_kg: weight_kg !== undefined ? parseFloat(weight_kg) : undefined,
        tag_number,
        status,
        location,
        notes
      });

      res.json({
        success: true,
        message: 'Livestock updated successfully',
        data: livestock
      });
    } catch (error) {
      console.error('Update livestock error:', error);

      if (error.message === 'Livestock not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update livestock'
      });
    }
  },

  /**
   * Delete livestock record
   * DELETE /api/livestock/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      await Livestock.delete(parseInt(id), req.user.id);

      res.json({
        success: true,
        message: 'Livestock deleted successfully'
      });
    } catch (error) {
      console.error('Delete livestock error:', error);

      if (error.message === 'Livestock not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete livestock'
      });
    }
  },

  /**
   * Add event to livestock
   * POST /api/livestock/:id/events
   */
  async addEvent(req, res) {
    try {
      const { id } = req.params;
      const { event_type, description, event_date } = req.body;

      if (!event_type) {
        return res.status(400).json({
          success: false,
          message: 'Event type is required'
        });
      }

      const validEventTypes = ['vaccination', 'illness', 'treatment', 'sale', 'death', 'weight_update', 'breeding', 'birth', 'other'];
      if (!validEventTypes.includes(event_type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}`
        });
      }

      // Verify ownership
      const isOwner = await Livestock.isOwner(parseInt(id), req.user.id);
      if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add events to this livestock'
        });
      }

      const event = await Livestock.addEvent({
        livestock_id: parseInt(id),
        event_type,
        description,
        event_date: event_date ? new Date(event_date) : new Date(),
        recorded_by: req.user.id
      });

      res.status(201).json({
        success: true,
        message: 'Event recorded successfully',
        data: event
      });
    } catch (error) {
      console.error('Add livestock event error:', error);

      if (error.message === 'Livestock not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to record event'
      });
    }
  },

  /**
   * Get events for a livestock
   * GET /api/livestock/:id/events
   */
  async getEvents(req, res) {
    try {
      const { id } = req.params;
      const { limit = 50 } = req.query;

      // Verify ownership
      const livestock = await Livestock.findById(parseInt(id));
      if (!livestock) {
        return res.status(404).json({
          success: false,
          message: 'Livestock not found'
        });
      }

      if (livestock.farmer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view events for this livestock'
        });
      }

      const events = await Livestock.getEvents(parseInt(id), { limit: parseInt(limit) });

      res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Get livestock events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch events'
      });
    }
  }
};

module.exports = livestockController;
