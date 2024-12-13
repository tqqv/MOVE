const responseHandler = require("../middlewares/responseHandler");
const { createNotificationEntity, getAllNotificationEntity } = require("../services/notificationEntityService");


const createNotificationEntityController = async (req, res, next) => {
  const data = req.body;
  const result = await createNotificationEntity(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllNotificationEntityController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 5;
  const result = await getAllNotificationEntity(page, pageSize)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createNotificationEntityController,
  getAllNotificationEntityController,
}
