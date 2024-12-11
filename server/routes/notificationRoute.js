const express = require("express");
const { verifyAdmin, verifyToken } = require("../middlewares/verifyToken");
const { getAllNotificationController, createNotificationController } = require("../controllers/notificationController.js");
const notificationRouter = express.Router();


notificationRouter.post('/', createNotificationController);
notificationRouter.get('/', verifyToken, getAllNotificationController);

module.exports = notificationRouter;
