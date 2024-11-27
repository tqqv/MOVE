const responseHandler = require("../middlewares/responseHandler");
const { sendMailConfirmWithdrawMethod, verifyOtp } = require("../services/authService");
const { createMethodWithdraw, updateVerifyAccountStripe, getLinkStripeVerify, cashout, getWithdrawInfor, getListCashoutHistory, deleteWithdrawInfor } = require("../services/cashoutService");
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
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;
  const sortCondition = {
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'DESC'
  };
  const result = await getListCashoutHistory(channelId, page, pageSize, startDate, endDate, sortCondition);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const sendMailConfirmWithdrawMethodController = async (req, res, next) => {
  const userId = req.user.id
  const result = await sendMailConfirmWithdrawMethod(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const checkOtpCodeController = async (req, res, next) => {
  const userId = req.user.id
  const otp = req.params.otp
  const result = verifyOtp(userId, otp);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleteWithdrawInforController = async (req, res, next) => {
  const channelId = req.user.channelId
  const stripeBankId = req.params.stripeBankId

  const result = await deleteWithdrawInfor(channelId, stripeBankId);

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
  sendMailConfirmWithdrawMethodController,
  checkOtpCodeController,
  deleteWithdrawInforController,
}
