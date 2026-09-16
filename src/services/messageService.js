const {
  Message,
  Chat,
  ChatParticipant,
} = require("../models");
const { Op } = require("sequelize");
const {
  deleteFromCloudinary,
} = require("./cloudinaryService");
const getMessages = async (
  chatId,
  userId,
  role,
  page = 1,
  limit = 20
) => {
  const offset = (page - 1) * limit;

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

  const { rows, count } =
    await Message.findAndCountAll({
      where: {
        chatId,
      },
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

  return {
    messages: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};
const sendMessage = async (
  chatId,
  senderId,
  role,
  content,
  messageType = "text",
  attachment = null
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

  if (
    (!content || !content.trim()) &&
    !attachment
  ) {
    throw new Error(
      "Message content or attachment is required"
    );
  }

  return Message.create({
    chatId,
    senderId,
    content: content?.trim() || null,
    messageType,

    attachmentUrl: attachment?.secure_url || null,
    attachmentName: attachment?.originalname || null,
    attachmentSize: attachment?.bytes || null,
    attachmentMimeType: attachment?.mimetype || null,
    attachmentPublicId: attachment?.public_id || null,
    attachmentResourceType: attachment?.resource_type || null,
  });
};
const markMessageDelivered = async (messageId, userId) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  const participant = await ChatParticipant.findOne({
    where: {
      chatId: message.chatId,
      userId,
    },
  });

  if (!participant || message.senderId === userId) {
    throw new Error("Access denied");
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
const editMessage = async (
  messageId,
  userId,
  content
) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  // Only message sender can edit
  if (message.senderId !== userId) {
    throw new Error(
      "You can only edit your own messages"
    );
  }

  // Deleted messages cannot be edited
  if (message.isDeleted) {
    throw new Error(
      "Deleted message cannot be edited"
    );
  }

  if (!content || !content.trim()) {
    throw new Error("Message content is required");
  }

  message.content = content.trim();
  message.isEdited = true;

  await message.save();

  return message;
};
const deleteMessage = async (
  messageId,
  userId
) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  // Only message sender can delete
  if (message.senderId !== userId) {
    throw new Error(
      "You can only delete your own messages"
    );
  }

  if (message.isDeleted) {
    throw new Error("Message is already deleted");
  }

  if (message.attachmentPublicId) {
    await deleteFromCloudinary(
      message.attachmentPublicId,
      message.attachmentResourceType || "image"
    );
  }

  message.isDeleted = true;
  message.content = null;

  await message.save();

  return message;
};
module.exports = {
  getMessages,
    sendMessage,
    markMessageDelivered,
    markMessageRead,
    getUnreadCount,
    getChatReceiver,
  editMessage,
  deleteMessage
};