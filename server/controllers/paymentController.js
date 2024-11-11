const responseHandler = require("../middlewares/responseHandler");
const { createPayment, createCardInfor, getCardInfoByUserId, createSetupIntent, deleteCardInfo } = require("../services/paymentService");

const createPaymentController = async(req, res, next) => {
  const result = await createPayment();

  res.send(result)
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

module.exports = {
  createPaymentController,
  createCardInforController,
  getCardInfoByUserIdController,
  createSetupIntentController,
  deleteCardInfoController,
}
