const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {}

  Message.init(
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

      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      messageType: {
        type: DataTypes.ENUM(
          "text",
          "image",
          "file",
          "audio",
          "video"
        ),
        allowNull: false,
        defaultValue: "text",
      },
      deliveredAt: {
  type: DataTypes.DATE,
  allowNull: true,
},

readAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true,
    }
  );

  return Message;
};