const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChatParticipant extends Model {}

  ChatParticipant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      chatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ChatParticipant",
      tableName: "chat_participants",
      timestamps: true,
    }
  );

  return ChatParticipant;
};