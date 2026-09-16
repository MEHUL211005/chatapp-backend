const notificationService = require("../services/notificationService");

const getNotifications = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await notificationService.getNotifications(
      req.user.userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (
  req,
  res,
  next
) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await notificationService.markNotificationRead(
        notificationId,
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
};