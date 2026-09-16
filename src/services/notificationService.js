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

const getNotifications = async (
  userId,
  page = 1,
  limit = 20
) => {
  const offset = (page - 1) * limit;

  const { rows, count } =
    await Notification.findAndCountAll({
      where: {
        userId,
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

  return {
    notifications: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
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