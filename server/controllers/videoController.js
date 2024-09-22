const { generateUploadLink } = require('../services/videoService');
const responseHandler = require("../middlewares/responseHandler");

const getUploadLink = async (req, res, next) => {
  const { fileName, fileSize } = req.body;
  const result = await generateUploadLink(fileName, fileSize);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};

module.exports = {
  getUploadLink
};