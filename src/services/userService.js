const { Op } = require("sequelize");

const { User } = require("../models");

const getUsers = async (
  currentUserId,
  page = 1,
  limit = 20
) => {
  const offset = (page - 1) * limit;

  const { rows, count } =
    await User.findAndCountAll({
      where: {
        isActive: true,
        id: {
          [Op.ne]: currentUserId,
        },
      },
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "lastSeen",
        "isOnline",
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

module.exports = {
  getUsers,
};