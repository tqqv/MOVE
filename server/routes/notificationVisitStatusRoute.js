const express = require("express");
const { verifyAdmin, verifyToken } = require("../middlewares/verifyToken.js");
const { getAllNotificationVisitStatusController, createNotificationVisitStatusController } = require("../controllers/notificationVisitStatusController.js");
const notificationVisitStatusRouter = express.Router();


notificationVisitStatusRouter.post('/', createNotificationVisitStatusController);
notificationVisitStatusRouter.get('/', verifyToken, getAllNotificationVisitStatusController);

module.exports = notificationVisitStatusRouter;
