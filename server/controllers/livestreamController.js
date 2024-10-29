const responseHandler = require("../middlewares/responseHandler");
const { createLivestream } = require("../services/livestreamService.js");


const createLivestreamController = async (req, res, next) => {
  const data = req.body;
  const result = await createLivestream(data);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createLivestreamController
}
