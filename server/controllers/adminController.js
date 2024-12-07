const responseHandler = require("../middlewares/responseHandler");
const { setStatusRequestChannel, getStatistic, getDataChartMoney, getTop5Channel, getTop5UserDeposit, getAllUsersRequest, userCount } = require("../services/adminService");

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

const getAllUsersRequestController = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const status = req.query.status ;
  const sortCondition = {
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc'
  };

  const result = await getAllUsersRequest(page, pageSize, status, sortCondition);

  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const userCountController = async (req, res, next) => {
  const result = await userCount()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}
module.exports = {
  setStatusRequestChannelController,
  getStatisticController,
  getDataChartMoneyController,
  getTop5ChannelController,
  getTop5UserDepositController,
  getAllUsersRequestController,
  userCountController
}
