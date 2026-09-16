const {
  User,
  Chat,
  Message,
  ChatParticipant,
  UserSession,
  Invitation,
  Notification,
} = require("../models");

const sequelize = require("../config/database");

const getDashboard = async () => {
  const [
    totalUsers,
    activeUsers,
    onlineUsers,
    totalChats,
    totalMessages,
  ] = await Promise.all([
    User.count(),
    User.count({
      where: {
        isActive: true,
      },
    }),
    User.count({
      where: {
        isOnline: true,
      },
    }),
    Chat.count(),
    Message.count(),
  ]);

  return {
    totalUsers,
    activeUsers,
    onlineUsers,
    totalChats,
    totalMessages,
  };
};

const getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    attributes: [
      "id",
      "name",
      "email",
      "role",
      "isActive",
      "isOnline",
      "lastSeen",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    users: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: [
      "id",
      "name",
      "email",
      "role",
      "isActive",
      "isOnline",
      "lastSeen",
      "createdAt",
    ],
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const activateUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.isActive = true;

  await user.save();

  return user;
};

const deactivateUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("Admin account cannot be deactivated");
  }

  user.isActive = false;

  await user.save();

  return user;
};
const deleteUser = async (userId, currentAdminId) => {
  if (userId === currentAdminId) {
    throw new Error("Admin cannot delete their own account");
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, {
      transaction,
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "admin") {
      throw new Error("Admin account cannot be deleted");
    }

    // Delete user's sessions
    await UserSession.destroy({
      where: {
        userId,
      },
      transaction,
    });

    // Delete invitations created by this user
    await Invitation.destroy({
      where: {
        invitedBy: userId,
      },
      transaction,
    });

    // Delete notifications where user is receiver
    await Notification.destroy({
      where: {
        userId,
      },
      transaction,
    });

    // Keep notifications where user was sender,
    // but remove sender reference
    await Notification.update(
      {
        senderId: null,
      },
      {
        where: {
          senderId: userId,
        },
        transaction,
      }
    );

    // Delete messages sent by the user
    await Message.destroy({
      where: {
        senderId: userId,
      },
      transaction,
    });

    // Remove user from chats
    await ChatParticipant.destroy({
      where: {
        userId,
      },
      transaction,
    });

    // Finally delete the user
    await user.destroy({
      transaction,
    });

    await transaction.commit();

    return {
      message: "User deleted successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const getAllChats = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Chat.findAndCountAll({
    include: [
      {
        model: ChatParticipant,
        as: "participants",
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
              "isActive",
              "isOnline",
              "lastSeen",
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
const getChatById = async (chatId) => {
  const chat = await Chat.findByPk(chatId, {
    include: [
      {
        model: ChatParticipant,
        as: "participants",
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
              "isActive",
              "isOnline",
              "lastSeen",
            ],
          },
        ],
      },
    ],
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  return chat;
};
const getChatMessages = async (
  chatId,
  page = 1,
  limit = 20
) => {
  const offset = (page - 1) * limit;

  // Check chat exists
  const chat = await Chat.findByPk(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const { rows, count } =
    await Message.findAndCountAll({
      where: {
        chatId,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: [
            "id",
            "name",
            "email",
            "role",
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
      limit,
      offset,
      distinct: true,
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
module.exports = {
  getDashboard,
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
    deleteUser,
    getAllChats,
    getChatById,
    getChatMessages,
};