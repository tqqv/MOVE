const {
  generateUploadLink,
  uploadThumbnailService,
  uploadMetadataService,
  saveVideoService,
  getVideoService,
  checkVideoStatusService,
  updateVideoService,
  getAllVideosService,
  getVideoByUserIdService,
  getVideoByVideoIdService,
  deleteVideoService,
  getListVideoByFilter,
  analyticsVideoById,
  getListVideoByChannel,
  getStateByCountryAndVideoId,
  increaseView,
  updateViewtime,
  getVideoWatchAlso,
  deleteMultipleVideosService,
  getStateByCountryAndVideoIdFromIp,
  getVideoYouMayLikeService,
  reupStreamService,
  getLatestReupStreamService,
} = require('../services/videoService');
const responseHandler = require("../middlewares/responseHandler");
const { createHashmapFromDBData, getFilteredSortedTopVideos } = require('../utils/redis/cache/videoCache');

const getUploadLink = async (req, res, next) => {
  const { fileName, fileSize } = req.body;
  try {
    const result = await generateUploadLink(fileName, fileSize);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res,next);
  }
};

const uploadThumbnail = async (req, res, next) => {
  const { videoUri } = req.body;
  const thumbnailPath = req.file.path;
  try {
    const result = await uploadThumbnailService(videoUri, thumbnailPath);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const uploadMetadata = async (req, res, next) => {
  const { videoUri, title, description } = req.body;
  try {
    const result = await uploadMetadataService(videoUri, title, description);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const saveVideo = async (req, res, next) => {
  const userId = req.user.channelId;
  const { videoId, title, description, thumbnailUrl, videoUrl, duration, status } = req.body;
  try {
    const result = await saveVideoService(videoId, userId, title, description, thumbnailUrl, videoUrl, duration, status);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const getVideo = async (req, res, next) => {
  const { videoUri } = req.body;
  try {
    const result = await getVideoService(videoUri);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const checkVideoStatus = async (req, res, next) => {
  const { videoUri } = req.body;
  try {
    const result = await checkVideoStatusService(videoUri);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const updateVideo = async (req, res, next) => {
  const { videoId, updateData } = req.body;
  try {
    const result = await updateVideoService(videoId, updateData);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const getAllVideos = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const result = await getAllVideosService(page, pageSize);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const getVideoByUserId = async (req, res, next) => {
  const { channelId } = req.params;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const level = req.query.level;
  const category = req.query.category;
  // updateAt = desc same as Most recent
  const sortCondition = {
    sortBy: req.query.sortBy || 'updatedAt',
    order: req.query.order || 'desc'
  };
  const result = await getVideoByUserIdService(channelId, page, pageSize, level, category, sortCondition);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const getVideoByVideoId = async (req, res, next) => {
  const { videoId } = req.params;
  const result = await getVideoByVideoIdService(videoId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const deleteVideo = async (req, res, next) => {
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

const deleteMultipleVideos = async (req, res, next) => {
  const { videoIds } = req.query;
  try {
    const results = await deleteMultipleVideosService(videoIds);
    responseHandler(200, results, 'Videos processed')(req, res, next);
  } catch (error) {
    console.log(error);
    responseHandler(error.status || 500, error.data, error.message)(req, res, next);
  }
};

const getListVideoByFilterController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 12;
  const level = req.query.level;
  const category = req.query.category;
  // updateAt = desc same as Most recent
  const sortCondition = {
    sortBy: req.query.sortBy || 'updatedAt',
    order: req.query.order || 'desc'
  };
  const result = await getListVideoByFilter(page, pageSize, level, category, sortCondition)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


const analyticsVideoByIdController = async(req, res, next) => {
  const videoId = req.params.videoId
  const channelId = req.user.channelId
  const days = req.query.days
  const result = await analyticsVideoById(videoId, channelId, days)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getStateByCountryAndVideoIdController = async(req, res, next) => {
  const videoId = req.params.videoId
  const country = req.query.country
  const days = req.query.days

  const result = await getStateByCountryAndVideoId(videoId, country, days)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getStateByCountryAndVideoIdFromIpController = async(req, res, next) => {
  const videoId = req.params.videoId
  const country = req.query.country
  const days = req.query.days

  const result = await getStateByCountryAndVideoIdFromIp(videoId, country, days)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListVideoByChannelController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const days = req.query.days
  const channelId = req.user.channelId;
  const sortCondition = {
    sortBy: req.query.sortBy || 'updatedAt',
    order: req.query.order || 'desc'
  };
  const result = await getListVideoByChannel(channelId, page, pageSize, sortCondition, days)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const increaseViewController = async(req, res, next) => {
  const userId = req.body.userId;
  const videoId = req.body.videoId;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const viewTime = req.body.viewTime;
  const result = await increaseView(userId, videoId, ip, viewTime)

  responseHandler(result.status, null, result.message)(req, res, next);
}

const updateViewtimeController = async(req, res, next) => {
  const userId = req.user.id;
  const videoId = req.body.videoId;
  const viewTime = req.body.viewTime;
  const result = await updateViewtime(userId, videoId, viewTime)

  responseHandler(result.status, null, result.message)(req, res, next);
}

const getVideoWatchAlsoController = async(req, res, next) => {
  const videoId= req.query.videoId;
  const category = req.query.category;
  const levelWorkout = req.query.levelWorkout;
  const result = await getVideoWatchAlso(category, levelWorkout, videoId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getTopVideoController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 12;
  const level = req.query.level;
  const category = req.query.category;
  // updateAt = desc same as Most recent
  const sortCondition = {
    sortBy: req.query.sortBy || 'score',
    order: req.query.order || 'desc'
  };
  const result = await getFilteredSortedTopVideos( {  level, category }, sortCondition.sortBy, page, pageSize, sortCondition.order);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getVideoYouMayLikeController = async(req, res, next) => {
  const userId = req.params.userId;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const sortCondition = {
    sortBy: req.query.sortBy || 'score',
    order: req.query.order || 'desc'
  };
  const result = await getVideoYouMayLikeService(userId, page, pageSize, sortCondition);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const reupStreamController = async (req, res, next) => {
  const channelId = req.user.channelId;
  const { livestreamId, videoId, title, description, thumbnailUrl, videoUrl, duration, status, categoryId, levelWorkoutsId } = req.body;
  try {
    const result = await reupStreamService(livestreamId, videoId, channelId, title, description, thumbnailUrl, videoUrl, duration, status, categoryId, levelWorkoutsId);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

const getLatestReupStreamController = async (req, res, next) => {
  const channelId  = req.query.channelId
  console.log(channelId);

  try {
    const result = await getLatestReupStreamService(channelId);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
};

module.exports = {
  getUploadLink,
  uploadThumbnail,
  uploadMetadata,
  saveVideo,
  getVideo,
  checkVideoStatus,
  updateVideo,
  getAllVideos,
  getVideoByUserId,
  getVideoByVideoId,
  deleteVideo,
  deleteMultipleVideos,
  getListVideoByFilterController,
  analyticsVideoByIdController,
  getListVideoByChannelController,
  getStateByCountryAndVideoIdController,
  increaseViewController,
  updateViewtimeController,
  getVideoWatchAlsoController,
  getStateByCountryAndVideoIdFromIpController,
  getTopVideoController,
  getVideoYouMayLikeController,
  reupStreamController,
  getLatestReupStreamController
};
