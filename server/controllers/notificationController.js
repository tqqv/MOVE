const responseHandler = require("../middlewares/responseHandler");
const { createNotification, getAllNotification } = require("../services/notificationService.js");


const createNotificationController = async (req, res, next) => {
  const result = await createNotification();

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationController = async(req, res, next) => {
  const result = await getAllNotification()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createNotificationController,
  getAllNotificationController,
}
