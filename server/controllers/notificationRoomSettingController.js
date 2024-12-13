const responseHandler = require("../middlewares/responseHandler");
const { createNotificationRoomSetting, getAllNotificationRoomSetting } = require("../services/notificationRoomSettingService.js");


const createNotificationRoomSettingController = async (req, res, next) => {
    const data = req.body;
    const userId = req.user.id || null;
    const channelId = req.user.channelId || null;

    const result = await updateNotificationRoomSetting(userId, channelId, data);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationRoomSettingController = async(req, res, next) => {
    const userId = req.user.id;
    const channelId = req.user.channelId;
    const result = await getAllNotificationRoomSetting(userId, channelId)

    responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createNotificationRoomSettingController,
  getAllNotificationRoomSettingController,
}
