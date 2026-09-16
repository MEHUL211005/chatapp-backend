
const express = require("express");

const router = express.Router();
const { paginationValidator } = require("../validators/paginationValidator");
const validate = require("../middleware/validationMiddleware");
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
  paginationValidator,
  validate,
  getChats
);

module.exports = router;