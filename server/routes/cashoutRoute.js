const express = require("express");
const { verifyStreamer } = require("../middlewares/verifyToken");
const { createMethodWithdrawController, createLinkStripeVerifyController, updateVerifyAccountStripeController, cashoutController, deleleStripeAccountId, getWithdrawInforController, getListCashoutHistoryController } = require("../controllers/cashoutController");
const cashoutRoute = express.Router();


cashoutRoute.get('/getWithdrawInfor', verifyStreamer, getWithdrawInforController);
cashoutRoute.get('/getListCashoutHistory', verifyStreamer, getListCashoutHistoryController);
cashoutRoute.post('/createWithdrawInfor', verifyStreamer, createMethodWithdrawController)
cashoutRoute.get('/createLinkStripeVerify', verifyStreamer, createLinkStripeVerifyController)
cashoutRoute.post('/updateStripeVerify', verifyStreamer, updateVerifyAccountStripeController)
cashoutRoute.post('/createPayout', verifyStreamer, cashoutController);

// cashoutRoute.post('/createBankToken', test4);
cashoutRoute.delete('/delete/:accountId', deleleStripeAccountId);


module.exports = cashoutRoute;
