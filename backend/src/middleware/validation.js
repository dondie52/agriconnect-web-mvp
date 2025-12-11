/**
 * Validation Middleware for AgriConnect
 * Input validation and sanitization
 */
const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+267|267)?[0-9]{8}$/).withMessage('Invalid Botswana phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['farmer', 'buyer', 'admin']).withMessage('Invalid role'),
  body('region_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid region ID'),
  validate
];

// Login validation
const loginValidation = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Listing validation
const listingValidation = [
  body('crop_id')
    .notEmpty().withMessage('Crop type is required')
    .isInt({ min: 1 }).withMessage('Invalid crop ID'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
  body('unit')
    .optional()
    .isIn(['kg', 'ton', 'bag', 'crate', 'bunch']).withMessage('Invalid unit'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('region_id')
    .notEmpty().withMessage('Region is required')
    .isInt({ min: 1 }).withMessage('Invalid region ID'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be under 1000 characters'),
  validate
];

// Price validation (admin)
const priceValidation = [
  body('crop_id')
    .notEmpty().withMessage('Crop ID is required')
    .isInt({ min: 1 }).withMessage('Invalid crop ID'),
  body('region_id')
    .notEmpty().withMessage('Region ID is required')
    .isInt({ min: 1 }).withMessage('Invalid region ID'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('unit')
    .optional()
    .isIn(['kg', 'ton', 'bag']).withMessage('Invalid unit'),
  validate
];

// Buyer request validation
const requestValidation = [
  body('crop_id')
    .notEmpty().withMessage('Crop type is required')
    .isInt({ min: 1 }).withMessage('Invalid crop ID'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
  body('max_price')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('region_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid region ID'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes must be under 500 characters'),
  validate
];

// Order validation (legacy single item)
const orderValidation = [
  body('listing_id')
    .notEmpty().withMessage('Listing ID is required')
    .isInt({ min: 1 }).withMessage('Invalid listing ID'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
  body('delivery_preference')
    .optional()
    .isIn(['pickup', 'delivery']).withMessage('Invalid delivery preference'),
  validate
];

// Checkout validation (cart-based with enhanced delivery)
const checkoutValidation = [
  // Delivery type validation
  body('delivery_type')
    .optional()
    .isIn(['pickup', 'delivery']).withMessage('Invalid delivery type. Must be pickup or delivery'),
  body('delivery_preference')
    .optional()
    .isIn(['pickup', 'delivery']).withMessage('Invalid delivery preference'),
  
  // Address validation - required for delivery
  body('address_text')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Address must be under 500 characters'),
  body('delivery_address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Delivery address must be under 500 characters'),
  
  // Coordinate validation - latitude
  body('latitude')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const lat = parseFloat(value);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      return true;
    }),
  
  // Coordinate validation - longitude
  body('longitude')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const lng = parseFloat(value);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      return true;
    }),
  
  // Phone number validation
  body('phone_number')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      // Allow various phone formats including international
      const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
      if (!phoneRegex.test(value)) {
        throw new Error('Invalid phone number format');
      }
      return true;
    }),
  
  // Delivery fee validation
  body('delivery_fee')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const fee = parseFloat(value);
      if (isNaN(fee) || fee < 0) {
        throw new Error('Delivery fee must be a non-negative number');
      }
      return true;
    }),
  
  // Total amount validation
  body('total_amount')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const amount = parseFloat(value);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Total amount must be a positive number');
      }
      return true;
    }),
  
  // Notes validation
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must be under 1000 characters'),
  
  // Custom validation to ensure delivery has required fields
  body().custom((value, { req }) => {
    const deliveryType = req.body.delivery_type || req.body.delivery_preference;
    if (deliveryType === 'delivery') {
      const address = req.body.address_text || req.body.delivery_address;
      if (!address || !address.trim()) {
        throw new Error('Delivery address is required for delivery orders');
      }
    }
    return true;
  }),
  
  validate
];

// Crop plan validation
const cropPlanValidation = [
  body('crop_id')
    .notEmpty().withMessage('Crop ID is required')
    .isInt({ min: 1 }).withMessage('Invalid crop ID'),
  body('season')
    .notEmpty().withMessage('Season is required')
    .isIn(['summer', 'winter', 'autumn', 'spring']).withMessage('Invalid season'),
  body('planned_quantity')
    .optional()
    .isFloat({ min: 0 }).withMessage('Quantity must be 0 or greater'),
  validate
];

// ID parameter validation
const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid ID'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  listingValidation,
  priceValidation,
  requestValidation,
  orderValidation,
  checkoutValidation,
  cropPlanValidation,
  idParamValidation
};
