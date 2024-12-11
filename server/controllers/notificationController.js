const responseHandler = require("../middlewares/responseHandler");
const { createNotification, getAllNotification } = require("../services/notificationService.js");


const createNotificationController = async (req, res, next) => {
  const result = await createNotification();

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationController = async(req, res, next) => {
  const userId = req.user.id;
  const channelId = req.user.channelId;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 6;

  const result = await getAllNotification(userId, channelId, page, pageSize)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createNotificationController,
  getAllNotificationController,
}
