"use strict";

module.exports = {
  async up(queryInterface) {
    // Find chats of a specific user quickly
    await queryInterface.addIndex(
      "chat_participants",
      ["userId"],
      {
        name: "idx_chat_participants_userId",
      }
    );

    // Fetch messages of a chat in chronological order
    await queryInterface.addIndex(
      "messages",
      ["chatId", "createdAt"],
      {
        name: "idx_messages_chatId_createdAt",
      }
    );

    // Find messages sent by a specific user
    await queryInterface.addIndex(
      "messages",
      ["senderId"],
      {
        name: "idx_messages_senderId",
      }
    );

    // Fetch user's notifications in newest-first pagination
    await queryInterface.addIndex(
      "notifications",
      ["userId", "createdAt"],
      {
        name: "idx_notifications_userId_createdAt",
      }
    );

    // Find all sessions belonging to a user
    await queryInterface.addIndex(
      "user_sessions",
      ["userId"],
      {
        name: "idx_user_sessions_userId",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "chat_participants",
      "idx_chat_participants_userId"
    );

    await queryInterface.removeIndex(
      "messages",
      "idx_messages_chatId_createdAt"
    );

    await queryInterface.removeIndex(
      "messages",
      "idx_messages_senderId"
    );

    await queryInterface.removeIndex(
      "notifications",
      "idx_notifications_userId_createdAt"
    );

    await queryInterface.removeIndex(
      "user_sessions",
      "idx_user_sessions_userId"
    );
  },
};