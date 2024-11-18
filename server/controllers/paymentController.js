const responseHandler = require("../middlewares/responseHandler");
const { createPayment, createCardInfor, getCardInfoByUserId, createSetupIntent, deleteCardInfo, getPaymentHistory } = require("../services/paymentService");

const createPaymentController = async(req, res, next) => {
  const userId  = req.user.id;
  const paymentMethodId = req.body.paymentMethodId;
  const repPackageId = req.body.repPackageId;

  const result = await createPayment(userId, paymentMethodId, repPackageId);

  responseHandler(result.status, null, result.message)(req, res, next);
}

const createCardInforController = async(req, res, next) => {
  const userId  = req.user.id;
  const cardName = req.body.cardName;
  const paymentMethodId = req.body.paymentMethodId;
  const country = req.body.country;

  const result = await createCardInfor(userId, cardName, paymentMethodId, country);

  responseHandler(result.status, null, result.message)(req, res, next);
}

const getCardInfoByUserIdController = async(req, res, next) => {
  const userId = req.user.id;
  const result = await getCardInfoByUserId(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const createSetupIntentController = async(req, res, next) => {
  const userId = req.user.id;
  const result = await createSetupIntent(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleteCardInfoController = async(req, res, next) => {
  const userId = req.user.id;
  const paymentMethodId = req.params.paymentMethodId;
  const result = await deleteCardInfo(userId, paymentMethodId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getPaymentHistoryController = async(req, res, next) => {
  const userId = req.user.id;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;
  const result = await getPaymentHistory(userId, page, pageSize, startDate, endDate);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createPaymentController,
  createCardInforController,
  getCardInfoByUserIdController,
  createSetupIntentController,
  deleteCardInfoController,
  getPaymentHistoryController,
}
