const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { getAllNotificationController, createNotificationController } = require("../controllers/notificationController.js");
const notificationRouter = express.Router();


notificationRouter.post('/', createNotificationController);
notificationRouter.get('/', getAllNotificationController);

module.exports = notificationRouter;
