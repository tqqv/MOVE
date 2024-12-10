const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createNotificationTranslationController, getAllNotificationTranslationController } = require("../controllers/notificationTranslationController.js");
const notificationTranslationRouter = express.Router();


notificationTranslationRouter.post('/', createNotificationTranslationController);
notificationTranslationRouter.get('/', getAllNotificationTranslationController);

module.exports = notificationTranslationRouter;
