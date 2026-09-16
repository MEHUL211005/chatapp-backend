const { ChatParticipant } = require("../models");

const messageService = require("../services/messageService");
const notificationService = require("../services/notificationService");

const registerChatSocket = (io, socket) => {
  // Join chat
  socket.on("join_chat", async (chatId) => {
    try {
      const participant = await ChatParticipant.findOne({
        where: {
          chatId,
          userId: socket.user.userId,
        },
      });

      if (!participant) {
        return socket.emit("socket_error", {
          message: "You are not a participant of this chat",
        });
      }

      socket.join(`chat:${chatId}`);

      console.log(
        `User ${socket.user.userId} joined chat:${chatId}`
      );

      socket.emit("chat_joined", {
        chatId,
      });
    } catch (error) {
      console.error("Join chat error:", error);

      socket.emit("socket_error", {
        message: "Unable to join chat",
      });
    }
  });

  // Leave chat
  socket.on("leave_chat", (chatId) => {
    socket.leave(`chat:${chatId}`);

    console.log(
      `User ${socket.user.userId} left chat:${chatId}`
    );

    socket.emit("chat_left", {
      chatId,
    });
  });

  // Typing indicator
  socket.on("typing_start", (chatId) => {
    socket.to(`chat:${chatId}`).emit("user_typing", {
      userId: socket.user.userId,
    });
  });

  socket.on("typing_stop", (chatId) => {
    socket.to(`chat:${chatId}`).emit(
      "user_stopped_typing",
      {
        userId: socket.user.userId,
      }
    );
  });

  // Message delivered
  socket.on("message_delivered", async (messageId) => {
    try {
      const message =
        await messageService.markMessageDelivered(
          messageId
        );

      io.to(`chat:${message.chatId}`).emit(
        "message_delivery_updated",
        {
          messageId: message.id,
          deliveredAt: message.deliveredAt,
        }
      );
    } catch (error) {
      console.error(
        "Message delivery error:",
        error
      );

      socket.emit("socket_error", {
        message:
          error.message ||
          "Unable to mark message as delivered",
      });
    }
  });

  // Read receipt
  socket.on("message_read", async (messageId) => {
    try {
      const message =
        await messageService.markMessageRead(
          messageId,
          socket.user.userId
        );

      io.to(`chat:${message.chatId}`).emit(
        "message_read_updated",
        {
          messageId: message.id,
          readAt: message.readAt,
        }
      );
    } catch (error) {
      console.error(
        "Message read error:",
        error
      );

      socket.emit("socket_error", {
        message:
          error.message ||
          "Unable to mark message as read",
      });
    }
  });

  // Send message
  socket.on("send_message", async (data) => {
    try {
      const {
        chatId,
        content,
        messageType = "text",
      } = data;

      const message =
        await messageService.sendMessage(
          chatId,
          socket.user.userId,
          socket.user.role,
          content,
          messageType
        );

      // Send new message to chat participants
      io.to(`chat:${chatId}`).emit(
        "new_message",
        message
      );

      // Find receiver
      const receiverId =
        await messageService.getChatReceiver(
          chatId,
          socket.user.userId
        );

      // Get receiver's latest unread count
      const unreadCount =
        await messageService.getUnreadCount(
          chatId,
          receiverId
        );

      // Send unread count only to receiver
      io.to(`user:${receiverId}`).emit(
        "unread_count_updated",
        {
          chatId,
          unreadCount,
        }
      );

      // Create persistent notification
      const notification =
        await notificationService.createNotification({
          userId: receiverId,
          type: "new_message",
          chatId,
          messageId: message.id,
          senderId: socket.user.userId,
          message: "You have a new message",
        });

      // Send real-time notification
      io.to(`user:${receiverId}`).emit(
        "new_notification",
        notification
      );
      // Edit message
socket.on("edit_message", async (data) => {
  try {
    const { messageId, content } = data;

    const message = await messageService.editMessage(
      messageId,
      socket.user.userId,
      content
    );

    io.to(`chat:${message.chatId}`).emit(
      "message_edited",
      message
    );
  } catch (error) {
    console.error("Edit message error:", error);

    socket.emit("socket_error", {
      message:
        error.message ||
        "Unable to edit message",
    });
  }
});
// Delete message for everyone
socket.on("delete_message", async (data) => {
  try {
    const { messageId } = data;

    const message =
      await messageService.deleteMessage(
        messageId,
        socket.user.userId
      );

    io.to(`chat:${message.chatId}`).emit(
      "message_deleted",
      message
    );
  } catch (error) {
    console.error(
      "Delete message error:",
      error
    );

    socket.emit("socket_error", {
      message:
        error.message ||
        "Unable to delete message",
    });
  }
});
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      socket.emit("socket_error", {
        message:
          error.message ||
          "Unable to send message",
      });
    }
  });
};

module.exports = registerChatSocket;