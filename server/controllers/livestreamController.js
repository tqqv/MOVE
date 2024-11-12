const responseHandler = require("../middlewares/responseHandler");
const { createLivestream, getLivestreamStatistics, endLivestream, updateLivestream, getLivestreamService, getLivestreamByUserNameService, getTopLivestreamService, getAllLivestreamService, getAllLivestreamSessionService, getLivestreamSessionDetailsService } = require("../services/livestreamService.js");


const createLivestreamController = async (req, res, next) => {
  const data = req.body;
  const result = await createLivestream(data);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const endLivestreamController = async (req, res, next) => {
  const livestreamId = req.params.livestreamId;
  const result = await endLivestream(livestreamId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}


const getLivestreamController = async (req, res, next) => {
  const username = req.params.username;
  const result = await getLivestreamService(username);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllLivestreamController = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const level = req.query.level;
  const category = req.query.category;
  const sortCondition = {
    sortBy: req.query.sortBy || 'totalView',
    order: req.query.order || 'desc'
  };
  const result = await getAllLivestreamService(page, pageSize, level, category, sortCondition);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}


const getLivestreamByUserController = async (req, res, next) => {
  const username = req.params.username;
  const result = await getLivestreamByUserNameService(username);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}


const getLivestreamStatisticController = async (req, res, next) => {
  const streamId = req.body.streamId;
  const result = await getLivestreamStatistics(streamId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const updateLivestreamController = async (req, res, next) => {
  const data = req.body;
  const result = await updateLivestream(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllLivestreamSessionController = async (req, res, next) => {
  const streamerId = req.user.channelId;

  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 5;
  const sortCondition = {
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc'
  };
  const result = await getAllLivestreamSessionService(streamerId, page, pageSize, sortCondition);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getLivestreamSessionDetailController = async (req, res, next) => {
  const livestreamId = req.params.livestreamId;
  const result = await getLivestreamSessionDetailsService(livestreamId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createLivestreamController,
  getLivestreamStatisticController,
  endLivestreamController,
  updateLivestreamController,
  getLivestreamController,
  getLivestreamByUserController,
  getAllLivestreamController,
  getAllLivestreamSessionController,
  getLivestreamSessionDetailController
}
