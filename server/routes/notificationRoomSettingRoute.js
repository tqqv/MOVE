const express = require("express");
const { verifyAdmin, verifyToken } = require("../middlewares/verifyToken");
const { getAllNotificationRoomSettingController, createNotificationRoomSettingController, getNotificationSettingStatusController } = require("../controllers/notificationRoomSettingController.js");
const notificationRoomSettingRouter = express.Router();


notificationRoomSettingRouter.post('/', verifyToken, createNotificationRoomSettingController);
notificationRoomSettingRouter.get('/', verifyToken, getAllNotificationRoomSettingController);
notificationRoomSettingRouter.get('/settingStatus', verifyToken, getNotificationSettingStatusController);

module.exports = notificationRoomSettingRouter;
