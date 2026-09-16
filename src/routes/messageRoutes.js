const express = require("express");

const router = express.Router();

const {
  getMessages,
    sendMessage,
  getUnreadCount,
  editMessage,
  deleteMessage,
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
// Edit message
router.patch(
  "/:chatId/messages/:messageId",
  authenticate,
  editMessage
);

// Delete message for everyone
router.delete(
  "/:chatId/messages/:messageId",
  authenticate,
  deleteMessage
);
module.exports = router;