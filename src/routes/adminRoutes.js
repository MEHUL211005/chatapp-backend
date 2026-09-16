const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  deleteUser,
  getAllChats,
  getChatById,
  getChatMessages,
} = require("../controllers/adminController");

const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize("admin"));

// Dashboard
router.get(
  "/dashboard",
  getDashboard
);

// Users
router.get(
  "/users",
  getAllUsers
);

router.get(
  "/users/:userId",
  getUserById
);

router.patch(
  "/users/:userId/activate",
  activateUser
);

router.patch(
  "/users/:userId/deactivate",
  deactivateUser
);
router.delete(
  "/users/:userId",
  deleteUser
);
// Chats
router.get(
  "/chats",
  getAllChats
);

router.get(
  "/chats/:chatId",
  getChatById
);
router.get(
  "/chats/:chatId/messages",
  getChatMessages
);

module.exports = router;