const express = require("express");

const router = express.Router();

const {
  getMessages,
    sendMessage,
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

module.exports = router;