const { ChatParticipant } = require("../models");
const messageService = require("../services/messageService");

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

    socket.emit("chat_left", {
      chatId,
    });
  });
socket.on("typing_start", (chatId) => {
  socket.to(`chat:${chatId}`).emit("user_typing", {
    userId: socket.user.userId,
  });
});

socket.on("typing_stop", (chatId) => {
  socket.to(`chat:${chatId}`).emit("user_stopped_typing", {
    userId: socket.user.userId,
  });
});
socket.on("message_delivered", async (messageId) => {
  try {
    const message =
      await messageService.markMessageDelivered(
        messageId
      );

    // Delivery update chat ke sabhi connected users ko
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
      const message = await messageService.markMessageRead(
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

      const message = await messageService.sendMessage(
        chatId,
        socket.user.userId,
        socket.user.role,
        content,
        messageType
      );

      io.to(`chat:${chatId}`).emit(
        "new_message",
        message
      );
    } catch (error) {
      console.error("Send message error:", error);

      socket.emit("socket_error", {
        message: error.message || "Unable to send message",
      });
    }
  });
};

module.exports = registerChatSocket;