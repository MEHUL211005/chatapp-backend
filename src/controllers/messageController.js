const messageService = require("../services/messageService");

const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const messages = await messageService.getMessages(
      chatId,
      req.user.userId,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, messageType } = req.body;

    const message = await messageService.sendMessage(
      chatId,
      req.user.userId,
      req.user.role,
      content,
      messageType
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
const getUnreadCount = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const unreadCount = await messageService.getUnreadCount(
      chatId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Unread count fetched successfully",
      data: {
        chatId,
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
const editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await messageService.editMessage(
      messageId,
      req.user.userId,
      content
    );

    return res.status(200).json({
      success: true,
      message: "Message edited successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await messageService.deleteMessage(
      messageId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getMessages,
  sendMessage,
  getUnreadCount,
  editMessage,
  deleteMessage,
};