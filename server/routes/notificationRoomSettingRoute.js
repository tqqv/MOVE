const express = require("express");
const { verifyAdmin, verifyToken } = require("../middlewares/verifyToken");
const { getAllNotificationRoomSettingController, createNotificationRoomSettingController } = require("../controllers/notificationRoomSettingController.js");
const notificationRoomSettingRouter = express.Router();


notificationRoomSettingRouter.post('/', createNotificationRoomSettingController);
notificationRoomSettingRouter.get('/', verifyToken, getAllNotificationRoomSettingController);

module.exports = notificationRoomSettingRouter;
