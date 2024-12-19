const responseHandler = require("../middlewares/responseHandler");
const { updateNotificationRoomSetting, getAllNotificationRoomSetting, getNotificationSettingStatus } = require("../services/notificationRoomSettingService.js");

const createNotificationRoomSettingController = async (req, res, next) => {
    const data = req.body;
    const userId = req.user.id || null;
    const channelId = req.user.channelId || null;

    const result = await updateNotificationRoomSetting(userId, channelId, data);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationRoomSettingController = async(req, res, next) => {
    const channelId = req.user.channelId;
    const userId = channelId ? null : req.user.id;
    const result = await getAllNotificationRoomSetting(userId, channelId)

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getNotificationSettingStatusController = async(req, res, next) => {
  const channelId = req.user.channelId;
  const userId = channelId ? null : req.user.id;
  const result = await getNotificationSettingStatus(userId, channelId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createNotificationRoomSettingController,
  getAllNotificationRoomSettingController,
  getNotificationSettingStatusController
}
