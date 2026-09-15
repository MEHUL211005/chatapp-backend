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
module.exports = {
  getMessages,
  sendMessage,
};