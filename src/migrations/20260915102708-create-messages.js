"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      chatId: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "chats",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      senderId: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      messageType: {
        type: Sequelize.ENUM(
          "text",
          "image",
          "file",
          "audio",
          "video"
        ),
        allowNull: false,
        defaultValue: "text",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("messages");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_messages_messageType";'
    );
  },
};