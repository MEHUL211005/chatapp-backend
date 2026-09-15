const chatService = require("../services/chatService");

const createChat = async (req, res, next) => {
  try {
    const { participantId } = req.body;

    const chat = await chatService.createChat(
      req.user.userId,
      participantId
    );

    return res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};
const getChats = async (req, res, next) => {
  try {
    const chats = await chatService.getChats(
      req.user.userId,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createChat,
  getChats,
};