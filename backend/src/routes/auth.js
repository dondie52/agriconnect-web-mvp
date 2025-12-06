/**
 * Auth Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { upload } = require('../middleware/upload');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/profile/photo', auth, upload.single('photo'), authController.uploadProfilePhoto);
router.put('/change-password', auth, authController.changePassword);

module.exports = router;
