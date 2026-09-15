const { User } = require("../models");

const getUsers = async (currentUserId) => {
  const users = await User.findAll({
    where: {
      isActive: true,
    },
    attributes: [
      "id",
      "name",
      "email",
      "role",
      "lastSeen",
    ],
  });

  return users.filter(
    (user) => user.id !== currentUserId
  );
};

module.exports = {
  getUsers,
};