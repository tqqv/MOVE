const responseHandler = require("../middlewares/responseHandler");
const { setCookies, clearCookies} = require("../utils/cookies");
const { setStatusRequestChannel, getStatistic, getDataChartMoney, getTop5Channel, getTop5UserDeposit, login, getAllUsersRequest } = require("../services/adminService");

const setStatusRequestChannelController = async (req, res, next) => {
  const data = req.body;
  console.log(data);
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
  const sortCondition = {
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc'
  };

  const result = await getAllUsersRequest(page, pageSize, sortCondition);

  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const loginController = async (req, res, next) => {
  const loginResult = await login(req.body);

  if (loginResult.cookie) {
    setCookies([
      {name: loginResult.cookie.cookieName, value: loginResult.cookie.token, days: 15, options: { httpOnly: true }},
      {name: 'isLogin', value: 'true', days: 15}
    ])(req, res);
  }

  responseHandler(loginResult.status, loginResult.data, loginResult.message)(
    req,
    res,
    next
  );
};

const logoutController = async (req, res, next) => {
  clearCookies([
    {name: 'accessToken', options: { httpOnly: true }},
    {name: 'isLogin'}
  ])(req, res, next);

  responseHandler(200, null, "Logout successful")(req, res, next);
};

module.exports = {
  setStatusRequestChannelController,
  getStatisticController,
  getDataChartMoneyController,
  getTop5ChannelController,
  getTop5UserDepositController,
  loginController,
  logoutController,
  getAllUsersRequestController
}
