const { Chat, ChatParticipant, User } = require("../models");
const sequelize = require("../config/database");

const createChat = async (currentUserId, participantId) => {
  if (currentUserId === participantId) {
    throw new Error("You cannot create a chat with yourself");
  }

  const participant = await User.findOne({
    where: {
      id: participantId,
      isActive: true,
    },
  });

  if (!participant) {
    throw new Error("User not found or inactive");
  }

  const existingChat = await Chat.findOne({
    include: [
      {
        model: ChatParticipant,
        as: "participants",
        where: {
          userId: currentUserId,
        },
        required: true,
      },
      {
        model: ChatParticipant,
        as: "participants",
        where: {
          userId: participantId,
        },
        required: true,
      },
    ],
  });

  if (existingChat) {
    return existingChat;
  }

  const transaction = await sequelize.transaction();

  try {
    const chat = await Chat.create(
      {},
      { transaction }
    );

    await ChatParticipant.bulkCreate(
      [
        {
          chatId: chat.id,
          userId: currentUserId,
        },
        {
          chatId: chat.id,
          userId: participantId,
        },
      ],
      { transaction }
    );

    await transaction.commit();

    return chat;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const getChats = async (userId, role) => {
  const where = {};

  if (role !== "admin") {
    where.userId = userId;
  }

  const chats = await Chat.findAll({
    include: [
      {
        model: ChatParticipant,
        as: "participants",
        where: Object.keys(where).length ? where : undefined,
        required: role !== "admin",
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
              "lastSeen",
            ],
          },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return chats;
};
module.exports = {
  createChat,
    getChats,
};