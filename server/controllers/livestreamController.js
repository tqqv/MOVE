const responseHandler = require("../middlewares/responseHandler");
const { createLivestream, getLivestreamStatistics, endLivestream, updateLivestream, getLivestreamService, getLivestreamByUserNameService } = require("../services/livestreamService.js");


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
  const livestreamId = req.params.livestreamId;
  const result = await getLivestreamService(livestreamId);
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


module.exports = {
  createLivestreamController,
  getLivestreamStatisticController,
  endLivestreamController,
  updateLivestreamController,
  getLivestreamController,
  getLivestreamByUserController
}
