const responseHandler = require("../middlewares/responseHandler");
const { setStatusRequestChannel, getStatistic, getDataChartMoney, getTop5Channel, getTop5UserDeposit, getAllUsersRequest, userCount, getAllUser, editProfileUser } = require("../services/adminService");
const { getPaymentHistory } = require("../services/paymentService");
const { getProfile } = require("../services/userService");
const { getListVideoByChannel, updateVideoService, deleteVideoService } = require("../services/videoService");

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

const getAllUserController = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const sortCondition = {
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc'
  };

  const result = await getAllUser(page, pageSize, sortCondition);

  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const getUserByIdController = async (req, res, next) => {
  const userId = req.params.userId
  const result = await getProfile(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const editProfileUserController = async (req, res, next) => {
  const userId = req.params.id;
  const data = req.body;
  const result = await editProfileUser(userId, data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListVideoByChannelIdController = async (req, res, next) => {
  const channelId = req.params.channelId;
  const page = req.query.page || 1;
  const days = req.query.days;
  const pageSize = req.query.pageSize || 10;
  const sortCondition = {
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc'
  };
  const result = await getListVideoByChannel(channelId, page, pageSize, sortCondition, days);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const EditVideoByIdController = async (req, res, next) => {
  const { videoId, updateData } = req.body;
  try {
    const result = await updateVideoService(videoId, updateData);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const deleteVideoByIdController = async (req, res, next) => {
  const { videoId } = req.params;
  console.log(videoId);
  try {
    const result = await deleteVideoService(videoId);
    console.log(result);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    console.log(error);
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
}

const getListPaymentByUserIdController = async(req, res, next) => {
  const userId = req.params.userId;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;
  const result = await getPaymentHistory(userId, page, pageSize, startDate, endDate);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  setStatusRequestChannelController,
  getStatisticController,
  getDataChartMoneyController,
  getTop5ChannelController,
  getTop5UserDepositController,
  getAllUsersRequestController,
  userCountController,
  getAllUserController,
  getUserByIdController,
  editProfileUserController,
  getListVideoByChannelIdController,
  EditVideoByIdController,
  deleteVideoByIdController,
  getListPaymentByUserIdController,
}
