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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await chatService.getChats(
      req.user.userId,
      req.user.role,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createChat,
  getChats,
};