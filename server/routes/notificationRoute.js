const express = require("express");
const { verifyAdmin, verifyToken } = require("../middlewares/verifyToken");
const { getAllNotificationController, createNotificationController, getUnReadNotificationController } = require("../controllers/notificationController.js");
const notificationRouter = express.Router();


notificationRouter.get('/unRead', verifyToken, getUnReadNotificationController);
notificationRouter.post('/', createNotificationController);
notificationRouter.get('/', verifyToken, getAllNotificationController);

module.exports = notificationRouter;
 