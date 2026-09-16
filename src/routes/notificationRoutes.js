const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markNotificationRead,
} = require("../controllers/notificationController");

const { authenticate } = require("../middleware/authMiddleware");

// Get logged-in user's notifications
router.get(
  "/",
  authenticate,
  getNotifications
);

// Mark notification as read
router.patch(
  "/:notificationId/read",
  authenticate,
  markNotificationRead
);

module.exports = router;