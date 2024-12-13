const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createNotificationEntityController, getAllNotificationEntityController } = require("../controllers/notificationEntityController");
const notificationEntityRouter = express.Router();


notificationEntityRouter.post('/', createNotificationEntityController);
notificationEntityRouter.get('/', getAllNotificationEntityController);

module.exports = notificationEntityRouter;
