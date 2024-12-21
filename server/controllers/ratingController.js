const responseHandler = require("../middlewares/responseHandler");
const { createRatingOnVideo, createRatingOnStream, getRatingOfVideo, getRatingOfStream } = require("../services/ratingService");


const createRatingOnVideoController = async(req, res, next) => {
  const userId = req.user.id
  const videoId = req.body.videoId
  const rating = req.body.rating
  const result = await createRatingOnVideo(userId, videoId, rating);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const createRatingOnStreamController = async(req, res, next) => {
  const userId = req.user.id
  const livestreamId = req.body.livestreamId
  const rating = req.body.rating
  const result = await createRatingOnStream(userId, livestreamId, rating);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getRatingOfVideoController = async(req, res, next) => {
  const userId = req.user.id
  const videoId = req.params.videoId
  const result = await getRatingOfVideo(userId, videoId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getRatingOfLivestreamController = async(req, res, next) => {
  const userId = req.user.id
  const livestreamId = req.params.livestreamId
  const result = await getRatingOfStream(userId, livestreamId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createRatingOnVideoController,
  createRatingOnStreamController,
  getRatingOfVideoController,
  getRatingOfLivestreamController,
}
