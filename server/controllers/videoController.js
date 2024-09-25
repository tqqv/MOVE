const { generateUploadLink, uploadThumbnailService, uploadMetadataService  } = require('../services/videoService');
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

module.exports = {
  getUploadLink,
  uploadThumbnail,
  uploadMetadata
};