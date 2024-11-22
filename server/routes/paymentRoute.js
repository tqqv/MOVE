var express = require("express");
const { createPaymentController, createCardInforController, getCardInfoByUserIdController, createSetupIntentController, deleteCardInfoController, getPaymentHistoryController } = require("../controllers/paymentController");
const { verifyUser } = require("../middlewares/verifyToken");
const paymentRouter = express.Router();

paymentRouter.get('/getClientSecret', verifyUser, createSetupIntentController);
paymentRouter.get('/getCardInfor', verifyUser, getCardInfoByUserIdController);
paymentRouter.get('/getPaymentHistory', verifyUser, getPaymentHistoryController);

paymentRouter.post('/checkout', verifyUser, createPaymentController);
paymentRouter.post('/createCardInfor', verifyUser, createCardInforController);

paymentRouter.delete('/:paymentMethodId', verifyUser, deleteCardInfoController);

module.exports = paymentRouter;
