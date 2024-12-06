const responseHandler = require("../middlewares/responseHandler");
const { setStatusRequestChannel, getStatistic, getDataChartMoney, getTop5Channel, getTop5UserDeposit, userCount, UnbanAccount, UnbanChannel } = require("../services/adminService");

const setStatusRequestChannelController = async (req, res, next) => {
  const data = req.body;
  const result = await setStatusRequestChannel(data.userId, data.status, data.text || null)

  responseHandler(result.status, null, result.message)(req, res, next);
}

const getStatisticController = async (req, res, next) => {

  const result = await getStatistic()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getDataChartMoneyController = async (req, res, next) => {
  const year = req.query.year || null
  const result = await getDataChartMoney(year)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getTop5ChannelController = async (req, res, next) => {
  const result = await getTop5Channel()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getTop5UserDepositController = async (req, res, next) => {
  const result = await getTop5UserDeposit()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const userCountController = async (req, res, next) => {
  const result = await userCount()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const UnbanAccountController = async (req, res, next) => {
  const userId = req.params.userId
  const result = await UnbanAccount(userId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const UnbanChannelController = async (req, res, next) => {
  const channelId = req.params.channelId
  const result = await UnbanChannel(channelId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  setStatusRequestChannelController,
  getStatisticController,
  getDataChartMoneyController,
  getTop5ChannelController,
  getTop5UserDepositController,
  userCountController,
  UnbanAccountController,
  UnbanChannelController
}
