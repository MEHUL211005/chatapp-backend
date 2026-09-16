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
const {
  paginationValidator,
} = require("../validators/paginationValidator");

const validate = require("../middleware/validationMiddleware");
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
  paginationValidator,
  validate, 
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
  paginationValidator,
  validate,
  getAllChats
);

router.get(
  "/chats/:chatId",
  getChatById
);
router.get(
  "/chats/:chatId/messages",
  paginationValidator,
  validate,
  getChatMessages
);

module.exports = router;