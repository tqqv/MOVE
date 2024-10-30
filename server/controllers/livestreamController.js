const responseHandler = require("../middlewares/responseHandler");
const { createLivestream, getLivestreamStatistics, endLivestream } = require("../services/livestreamService.js");


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

const getLivestreamStatisticController = async (req, res, next) => {
  const streamId = req.body.streamId;
  const result = await getLivestreamStatistics(streamId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createLivestreamController,
  getLivestreamStatisticController,
  endLivestreamController,
}
