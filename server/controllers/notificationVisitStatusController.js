const responseHandler = require("../middlewares/responseHandler");
const { createNotificationVisitStatus, getAllNotificationVisitStatus, markAllNotiAsRecievied, markAllNotiAsRead, markOneNotiAsRead } = require("../services/notificationVisitStatusService.js");


const createNotificationVisitStatusController = async (req, res, next) => {
    const data = req.body;
    const userId = req.user.id || null;
    const channelId = req.user.channelId || null;

    const result = await updateNotificationVisitStatus(userId, channelId, data);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationVisitStatusController = async(req, res, next) => {
    const userId = req.user.id;
    const channelId = req.user.channelId;
    const result = await getAllNotificationVisitStatus(userId, channelId)

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const markAllNotiAsRecieviedController = async(req, res, next) => {
  const userId = req.user.id;
  const channelId = req.user.channelId;
  const result = await markAllNotiAsRecievied(userId, channelId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const markAllNotiAsReadController = async(req, res, next) => {
  const userId = req.user.id;
  const channelId = req.user.channelId;
  const result = await markAllNotiAsRead(userId, channelId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


const markOneNotiAsReadController = async(req, res, next) => {
  const notiId = req.params.notiId;
  const result = await markOneNotiAsRead(notiId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createNotificationVisitStatusController,
  getAllNotificationVisitStatusController,
  markAllNotiAsRecieviedController,
  markAllNotiAsReadController,
  markOneNotiAsReadController
}
