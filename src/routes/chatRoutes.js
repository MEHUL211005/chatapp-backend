const express = require("express");

const router = express.Router();

const {
  createChat,
  getChats,
} = require("../controllers/chatController");

const { authenticate } = require("../middleware/authMiddleware");

router.post(
  "/",
  authenticate,
  createChat
);

router.get(
  "/",
  authenticate,
  getChats
);

module.exports = router;