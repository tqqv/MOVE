const express = require("express");
const { verifyAdmin, verifyToken, verifyStreamer } = require("../middlewares/verifyToken.js");
const { getAllNotificationVisitStatusController, createNotificationVisitStatusController, markAllNotiAsRecieviedController, markAllNotiAsReadController, markOneNotiAsReadController } = require("../controllers/notificationVisitStatusController.js");
const notificationVisitStatusRouter = express.Router();


notificationVisitStatusRouter.post('/markAllAsRecieved', verifyToken, markAllNotiAsRecieviedController);
notificationVisitStatusRouter.post('/markAllAsRead', verifyToken, markAllNotiAsReadController);
notificationVisitStatusRouter.post('/markAsRead/:notiId', verifyToken, markOneNotiAsReadController);
notificationVisitStatusRouter.post('/', createNotificationVisitStatusController);
notificationVisitStatusRouter.get('/', verifyToken, getAllNotificationVisitStatusController);

module.exports = notificationVisitStatusRouter;
