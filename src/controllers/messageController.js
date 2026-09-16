const messageService = require("../services/messageService");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const notificationService = require("../services/notificationService");
const {
  getMessageTypeFromMime,
} = require("../utils/messageType");
const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await messageService.getMessages(
      chatId,
      req.user.userId,
      req.user.role,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    let messageType = "text";
    let attachment = null;
    let uploadResult = null;

    // If file is attached
    if (req.file) {
      // Determine message type from MIME type
      messageType = getMessageTypeFromMime(
        req.file.mimetype
      );

      // Upload file to Cloudinary
      uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "chat-app/attachments"
      );

      attachment = {
        secure_url: uploadResult.secure_url,
        originalname: req.file.originalname,
        bytes: req.file.size,
        mimetype: req.file.mimetype,
        public_id: uploadResult.public_id,
        resource_type: uploadResult.resource_type,
      };
    }

    // Save message in database
    let message;
    try {
      message = await messageService.sendMessage(
        chatId,
        req.user.userId,
        req.user.role,
        content,
        messageType,
        attachment
      );
    } catch (error) {
      if (uploadResult?.public_id) {
        await deleteFromCloudinary(
          uploadResult.public_id,
          uploadResult.resource_type || "image"
        ).catch((cleanupError) => {
          console.error("Cloudinary cleanup failed:", cleanupError.message);
        });
      }

      throw error;
    }

    // Get Socket.IO instance
    const io = req.app.get("io");

    // Send real-time message to chat room
    io.to(`chat:${chatId}`).emit(
      "new_message",
      message
    );

    try {
      const receiverId = await messageService.getChatReceiver(
        chatId,
        req.user.userId
      );
      const unreadCount = await messageService.getUnreadCount(
        chatId,
        receiverId
      );

      io.to(`user:${receiverId}`).emit(
        "unread_count_updated",
        { chatId, unreadCount }
      );

      const notification = await notificationService.createNotification({
        userId: receiverId,
        type: "new_message",
        chatId,
        messageId: message.id,
        senderId: req.user.userId,
        message:
          message.messageType === "text"
            ? "You have a new message"
            : `You received a new ${message.messageType}`,
      });

      io.to(`user:${receiverId}`).emit(
        "new_notification",
        notification
      );
    } catch (sideEffectError) {
      console.error(
        "Message notification update failed:",
        sideEffectError.message
      );
    }

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