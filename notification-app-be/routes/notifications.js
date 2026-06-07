const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { paginate } = require('../utils/prioritySort');

// GET /api/notifications
// Optional query params: type (placement, result, event), page, limit
router.get('/notifications', async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    let notifications;
    if (type) {
      notifications = await notificationService.fetchNotifications(type);
    } else {
      notifications = await notificationService.fetchAllNotifications();
    }
    
    // Sort by recency (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const paginatedResult = paginate(notifications, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      ...paginatedResult
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/priority
// Priority Inbox: Sorts by Priority (Placement > Result > Event) then Recency
router.get('/notifications/priority', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await notificationService.getPriorityNotifications(parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/count
router.get('/notifications/count', async (req, res, next) => {
  try {
    const counts = await notificationService.getNotificationCounts();
    res.json({
      success: true,
      counts
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
