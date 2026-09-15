const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {}

  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      timestamps: true,
    }
  );

  return Chat;
};