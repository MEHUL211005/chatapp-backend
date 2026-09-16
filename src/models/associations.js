const setupAssociations = (models) => {
  const {
    User,
    Invitation,
    Chat,
    ChatParticipant,
    Message,
    Notification
  } = models;

  // User ↔ Invitation
  User.hasMany(Invitation, {
    foreignKey: "invitedBy",
    as: "invitations",
  });

  Invitation.belongsTo(User, {
    foreignKey: "invitedBy",
    as: "inviter",
  });

  // User ↔ ChatParticipant
  User.hasMany(ChatParticipant, {
    foreignKey: "userId",
    as: "chatParticipants",
  });

  ChatParticipant.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Chat ↔ ChatParticipant
  Chat.hasMany(ChatParticipant, {
    foreignKey: "chatId",
    as: "participants",
  });

  ChatParticipant.belongsTo(Chat, {
    foreignKey: "chatId",
    as: "chat",
  });

  // Chat ↔ Message
  Chat.hasMany(Message, {
    foreignKey: "chatId",
    as: "messages",
  });

  Message.belongsTo(Chat, {
    foreignKey: "chatId",
    as: "chat",
  });

  // User ↔ Message
  User.hasMany(Message, {
    foreignKey: "senderId",
    as: "messages",
  });

  Message.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender",
  });
    User.hasMany(Notification, {
    foreignKey: "userId",
    as: "notifications",
  });

  Notification.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(Notification, {
    foreignKey: "senderId",
    as: "sentNotifications",
  });

  Notification.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender",
  });

  Chat.hasMany(Notification, {
    foreignKey: "chatId",
    as: "notifications",
  });

  Notification.belongsTo(Chat, {
    foreignKey: "chatId",
    as: "chat",
  });

  Message.hasMany(Notification, {
    foreignKey: "messageId",
    as: "notifications",
  });

  Notification.belongsTo(Message, {
    foreignKey: "messageId",
    as: "messageRecord",
  });
};

module.exports = setupAssociations;