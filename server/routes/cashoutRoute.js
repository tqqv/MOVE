const express = require("express");
const { verifyStreamer } = require("../middlewares/verifyToken");
const { createMethodWithdrawController, createLinkStripeVerifyController, updateVerifyAccountStripeController, cashoutController, deleleStripeAccountId, getWithdrawInforController, getListCashoutHistoryController, sendMailConfirmWithdrawMethodController, checkOtpCodeController, deleteWithdrawInforController, exchangeRepsController, getSystemConfigByKeyController } = require("../controllers/cashoutController");
const cashoutRoute = express.Router();

cashoutRoute.get('/verifyOtp/:otp', verifyStreamer, checkOtpCodeController);
cashoutRoute.get('/sendMailOtp', verifyStreamer, sendMailConfirmWithdrawMethodController);
cashoutRoute.get('/getWithdrawInfor', verifyStreamer, getWithdrawInforController);
cashoutRoute.get('/getListCashoutHistory', verifyStreamer, getListCashoutHistoryController);
cashoutRoute.post('/createWithdrawInfor', verifyStreamer, createMethodWithdrawController)
cashoutRoute.get('/createLinkStripeVerify', verifyStreamer, createLinkStripeVerifyController)
cashoutRoute.post('/updateStripeVerify', verifyStreamer, updateVerifyAccountStripeController)
cashoutRoute.post('/createPayout', verifyStreamer, cashoutController);
cashoutRoute.post('/exchange', verifyStreamer, exchangeRepsController);

cashoutRoute.delete('/delete/:accountId', deleleStripeAccountId);
cashoutRoute.delete('/deleteWithdrawInfor/:stripeBankId', verifyStreamer, deleteWithdrawInforController);

cashoutRoute.get("/getSystemConfigByKey/:key", verifyStreamer, getSystemConfigByKeyController)

module.exports = cashoutRoute;
