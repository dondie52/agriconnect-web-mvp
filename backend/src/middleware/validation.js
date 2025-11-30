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

// Order validation
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
  cropPlanValidation,
  idParamValidation
};
