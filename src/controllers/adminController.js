const adminService = require("../services/adminService");

// Dashboard
const getDashboard = async (req, res, next) => {
  try {
    const dashboard =
      await adminService.getDashboard();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users =
      await adminService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user =
      await adminService.getUserById(userId);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Activate user
const activateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user =
      await adminService.activateUser(userId);

    return res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate user
const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user =
      await adminService.deactivateUser(userId);

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await adminService.deleteUser(
      userId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
// Get all chats
const getAllChats = async (req, res, next) => {
  try {
    const chats =
      await adminService.getAllChats();

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

// Get single chat
const getChatById = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat =
      await adminService.getChatById(chatId);

    return res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};
const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const messages =
      await adminService.getChatMessages(chatId);

    return res.status(200).json({
      success: true,
      message: "Chat messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getDashboard,
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
    deleteUser,
    getAllChats,
    getChatById,
    getChatMessages,
};