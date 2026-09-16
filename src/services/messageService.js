const {
  Message,
  Chat,
  ChatParticipant,
} = require("../models");
const { Op } = require("sequelize");
const getMessages = async (chatId, userId, role) => {
  const chat = await Chat.findByPk(chatId, {
    include: [
      {
        model: ChatParticipant,
        as: "participants",
      },
    ],
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (participant) => participant.userId === userId
  );

  if (role !== "admin" && !isParticipant) {
    throw new Error("Access denied");
  }

  const messages = await Message.findAll({
    where: {
      chatId,
    },
    order: [["createdAt", "ASC"]],
  });

  return messages;
};
const sendMessage = async (
  chatId,
  senderId,
  role,
  content,
  messageType = "text"
) => {
  const chat = await Chat.findByPk(chatId, {
    include: [
      {
        model: ChatParticipant,
        as: "participants",
      },
    ],
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (participant) => participant.userId === senderId
  );

  if (role !== "admin" && !isParticipant) {
    throw new Error("Access denied");
  }

  if (!content || !content.trim()) {
    throw new Error("Message content is required");
  }

  const message = await Message.create({
    chatId,
    senderId,
    content: content.trim(),
    messageType,
  });

  return message;
};
const markMessageDelivered = async (messageId) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (!message.deliveredAt) {
    message.deliveredAt = new Date();
    await message.save();
  }

  return message;
};
const markMessageRead = async (messageId, userId) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  // Check whether current user belongs to this chat
  const participant = await ChatParticipant.findOne({
    where: {
      chatId: message.chatId,
      userId,
    },
  });

  if (!participant) {
    throw new Error("Access denied");
  }

  // Already read
  if (message.readAt) {
    return message;
  }

  message.readAt = new Date();

  // Read hone ka matlab delivered bhi ho chuka
  if (!message.deliveredAt) {
    message.deliveredAt = message.readAt;
  }

  await message.save();

  return message;
};
const getUnreadCount = async (chatId, userId) => {
  const chat = await Chat.findByPk(chatId, {
    include: [
      {
        model: ChatParticipant,
        as: "participants",
      },
    ],
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (participant) => participant.userId === userId
  );

  if (!isParticipant) {
    throw new Error("Access denied");
  }

  const unreadCount = await Message.count({
    where: {
      chatId,
      readAt: null,
      senderId: {
        [Op.ne]: userId,
      },
    },
  });

  return unreadCount;
};
const getChatReceiver = async (chatId, senderId) => {
  const participant = await ChatParticipant.findOne({
    where: {
      chatId,
      userId: {
        [Op.ne]: senderId,
      },
    },
  });

  if (!participant) {
    throw new Error("Chat receiver not found");
  }

  return participant.userId;
};
module.exports = {
  getMessages,
    sendMessage,
    markMessageDelivered,
    markMessageRead,
    getUnreadCount,
    getChatReceiver,
};