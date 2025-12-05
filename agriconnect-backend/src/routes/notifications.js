/**
 * Notification Routes for AgriConnect
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');
const { idParamValidation } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.get('/', notificationController.getAll);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:id/read', idParamValidation, notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', idParamValidation, notificationController.delete);

module.exports = router;
