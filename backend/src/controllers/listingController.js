/**
 * Listing Controller for AgriConnect
 * Handles produce listing operations
 */
const Listing = require('../models/Listing');
const Analytics = require('../models/Analytics');
const { deleteFile } = require('../middleware/upload');

const listingController = {
  // Create a new listing
  async create(req, res) {
    try {
      const { crop_id, quantity, unit, price, region_id, description } = req.body;
      
      // Handle uploaded images
      const images = req.files ? req.files.map(file => file.filename) : [];

      const listing = await Listing.create({
        farmer_id: req.user.id,
        crop_id,
        quantity,
        unit,
        price,
        region_id,
        description,
        images
      });

      // Get full listing details
      const fullListing = await Listing.findById(listing.id);

      res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        data: fullListing
      });
    } catch (error) {
      console.error('Create listing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create listing'
      });
    }
  },

  // Get all listings (public, with filters)
  async getAll(req, res) {
    try {
      const {
        crop_id,
        region_id,
        min_price,
        max_price,
        search,
        page = 1,
        limit = 12,
        sort_by,
        sort_order
      } = req.query;

      const result = await Listing.findAll({
        crop_id: crop_id ? parseInt(crop_id) : null,
        region_id: region_id ? parseInt(region_id) : null,
        min_price: min_price ? parseFloat(min_price) : null,
        max_price: max_price ? parseFloat(max_price) : null,
        search,
        page: parseInt(page),
        limit: parseInt(limit),
        sort_by,
        sort_order
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get listings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch listings'
      });
    }
  },

  // Get single listing by ID
  async getById(req, res) {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }

      // Track view (if viewer is not the owner)
      if (!req.user || req.user.id !== listing.farmer_id) {
        await Analytics.trackView(listing.id, req.user?.id);
      }

      res.json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Get listing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch listing'
      });
    }
  },

  // Update listing
  async update(req, res) {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }

      // Check ownership
      if (listing.farmer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this listing'
        });
      }

      const { crop_id, quantity, unit, price, region_id, description, status } = req.body;

      // Handle new images
      let images = listing.images ? JSON.parse(listing.images) : [];
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.filename);
        images = [...images, ...newImages];
      }

      const updatedListing = await Listing.update(req.params.id, {
        crop_id,
        quantity,
        unit,
        price,
        region_id,
        description,
        status,
        images
      });

      const fullListing = await Listing.findById(updatedListing.id);

      res.json({
        success: true,
        message: 'Listing updated successfully',
        data: fullListing
      });
    } catch (error) {
      console.error('Update listing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update listing'
      });
    }
  },

  // Delete listing
  async delete(req, res) {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }

      // Check ownership
      if (listing.farmer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this listing'
        });
      }

      // Delete associated images
      if (listing.images) {
        const images = JSON.parse(listing.images);
        images.forEach(img => deleteFile(img));
      }

      await Listing.delete(req.params.id);

      res.json({
        success: true,
        message: 'Listing deleted successfully'
      });
    } catch (error) {
      console.error('Delete listing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete listing'
      });
    }
  },

  // Get farmer's own listings
  async getMyListings(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const result = await Listing.findByFarmer(req.user.id, {
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get my listings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch listings'
      });
    }
  },

  // Get farmer listing stats
  async getStats(req, res) {
    try {
      const stats = await Listing.getStats(req.user.id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  },

  // Delete an image from listing
  async deleteImage(req, res) {
    try {
      const { id, imageIndex } = req.params;
      
      const listing = await Listing.findById(id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }

      if (listing.farmer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      const images = listing.images ? JSON.parse(listing.images) : [];
      const index = parseInt(imageIndex);

      if (index < 0 || index >= images.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image index'
        });
      }

      // Delete the file
      deleteFile(images[index]);

      // Remove from array
      images.splice(index, 1);

      await Listing.update(id, { images });

      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  }
};

module.exports = listingController;
