const responseHandler = require("../middlewares/responseHandler");
const { createMethodWithdraw, updateVerifyAccountStripe, getLinkStripeVerify, cashout, getWithdrawInfor, getListCashoutHistory } = require("../services/cashoutService");
const { createStripeAccountId, createPayout, attachBankAccountToConnectedAccount, createBankToken, deleteStripeAccountId } = require("../services/stripeService");

const createMethodWithdrawController = async (req, res, next) => {
  const channelId = req.user.channelId
  const bankData = req.body.bankData
  const result = await createMethodWithdraw(channelId, bankData);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const createLinkStripeVerifyController = async (req, res, next) => {
  const channelId = req.user.channelId
  const result = await getLinkStripeVerify(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const updateVerifyAccountStripeController = async (req, res, next) => {
  const channelId = req.user.channelId
  const result = await updateVerifyAccountStripe(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const cashoutController = async (req, res, next) => {
  const channelId = req.user.channelId
  const rep = req.body.rep
  const result = await cashout(channelId, rep);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleleStripeAccountId = async (req, res, next) => {
  const accountId = req.params.accountId
  const result = await deleteStripeAccountId(accountId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getWithdrawInforController = async (req, res, next) => {
  const channelId = req.user.channelId
  const result = await getWithdrawInfor(channelId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListCashoutHistoryController = async (req, res, next) => {
  const channelId = req.user.channelId
  const result = await getListCashoutHistory(channelId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createMethodWithdrawController,
  createLinkStripeVerifyController,
  updateVerifyAccountStripeController,
  cashoutController,
  deleleStripeAccountId,
  getWithdrawInforController,
  getListCashoutHistoryController,
}
