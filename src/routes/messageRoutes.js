const express = require("express");

const router = express.Router();

const {
  getMessages,
    sendMessage,
  getUnreadCount,
} = require("../controllers/messageController");

const { authenticate } = require("../middleware/authMiddleware");

router.get(
  "/:chatId/messages",
  authenticate,
  getMessages
);
router.post(
  "/:chatId/messages",
  authenticate,
  sendMessage
);
router.get(
  "/:chatId/unread-count",
  authenticate,
  getUnreadCount
);

module.exports = router;