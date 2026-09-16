const { Notification } = require("../models");

const createNotification = async ({
  userId,
  type,
  chatId = null,
  messageId = null,
  senderId = null,
  message,
}) => {
  const notification = await Notification.create({
    userId,
    type,
    chatId,
    messageId,
    senderId,
    message,
    isRead: false,
  });

  return notification;
};

const getNotifications = async (userId) => {
  const notifications = await Notification.findAll({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
  });

  return notifications;
};

const markNotificationRead = async (
  notificationId,
  userId
) => {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    await notification.save();
  }

  return notification;
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
};