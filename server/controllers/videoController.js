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
  deleteVideoService
} = require('../services/videoService');
const responseHandler = require("../middlewares/responseHandler");

const getUploadLink = async (req, res, next) => {
  const { fileName, fileSize } = req.body;
  const result = await generateUploadLink(fileName, fileSize);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const uploadThumbnail = async (req, res, next) => {
  const { videoUri } = req.body;
  const thumbnailPath = req.file.path;
  const result = await uploadThumbnailService(videoUri, thumbnailPath);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const uploadMetadata = async (req, res, next) => {
  const { videoUri, title, description } = req.body;
  const result = await uploadMetadataService(videoUri, title, description);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const saveVideo = async (req, res, next) => {
  const userId = req.user.channelId;
  const { videoId, title, description, thumbnailUrl, videoUrl, duration, status } = req.body;
  const result = await saveVideoService(videoId, userId, title, description, thumbnailUrl, videoUrl, duration, status);
  responseHandler(result.status, result.data, result.message)(req, res, next);
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
  const result = await getAllVideosService();
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const getVideoByUserId = async (req, res, next) => {
  const { channelId } = req.params;
  const result = await getVideoByUserIdService(channelId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const getVideoByVideoId = async (req, res, next) => {
  const { videoId } = req.params;
  const result = await getVideoByVideoIdService(videoId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const deleteVideo = async (req, res, next) => {
  const { videoId } = req.body;
  try {
    const result = await deleteVideoService(videoId);
    responseHandler(result.status, result.data, result.message)(req, res, next);
  } catch (error) {
    responseHandler(error.status, error.data, error.message)(req, res, next);
  }
}

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
  deleteVideo
};