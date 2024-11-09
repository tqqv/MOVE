var express = require("express");
const { createPaymentController, createCardInforController, getCardInfoByUserIdController } = require("../controllers/paymentController");
const { verifyUser } = require("../middlewares/verifyToken");
const paymentRouter = express.Router();

paymentRouter.get('/getCardInfor', verifyUser, getCardInfoByUserIdController);
paymentRouter.post('/checkout', createPaymentController);
paymentRouter.post('/createCardInfor', verifyUser, createCardInforController);


module.exports = paymentRouter;
