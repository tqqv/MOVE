const responseHandler = require("../middlewares/responseHandler");
const { createNotificationTranslation, getAllNotificationTranslation } = require("../services/notificationTranslationService");


const createNotificationTranslationController = async (req, res, next) => {
  const { notificationEntityId, translations } = req.body;
  const result = await createNotificationTranslation(notificationEntityId, translations);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationTranslationController = async(req, res, next) => {
  const result = await getAllNotificationTranslation()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createNotificationTranslationController,
  getAllNotificationTranslationController,
}
