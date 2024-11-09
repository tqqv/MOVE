const responseHandler = require("../middlewares/responseHandler");
const { createPayment, createCardInfor, getCardInfoByUserId } = require("../services/paymentService");

const createPaymentController = async(req, res, next) => {
  const result = await createPayment();

  res.send(result)
}

const createCardInforController = async(req, res, next) => {
  const userId  = req.user.id;
  const cardNumber = req.body.cardNumber;
  const cardName = req.body.cardName;
  const paymentMethodId = req.body.paymentMethodId;
  const cardType = req.body.cardType;
  const country = req.body.country;
  const expirationDate = req.body.expirationDate;

  const result = await createCardInfor(userId, cardNumber, cardName, cardType, paymentMethodId, expirationDate, country);

  responseHandler(result.status, null, result.message)(req, res, next);
}

const getCardInfoByUserIdController = async(req, res, next) => {
  const userId = req.user.id;
  const result = await getCardInfoByUserId(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createPaymentController,
  createCardInforController,
  getCardInfoByUserIdController,
}
