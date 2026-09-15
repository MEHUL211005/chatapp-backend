const setupAssociations = (models) => {
  const {
    User,
    Invitation,
    Chat,
    ChatParticipant,
    Message,
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
};

module.exports = setupAssociations;