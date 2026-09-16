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
const getChats = async (
  userId,
  role,
  page = 1,
  limit = 20
) => {
  const offset = (page - 1) * limit;

  const where =
    role !== "admin"
      ? { userId }
      : undefined;

  const { rows, count } =
    await Chat.findAndCountAll({
      include: [
        {
          model: ChatParticipant,
          as: "participants",
          where,
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
                "isOnline",
              ],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

  return {
    chats: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

module.exports = {
  createChat,
  getChats,
};