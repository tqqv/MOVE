const responseHandler = require("../middlewares/responseHandler");
const { getCateFollowByUserIdService } = require("../services/categoryFollowService.js");


const getCateFollowByUserIdController = async (req, res, next) => {
  const userId = req.user.id;
  const result = await getCateFollowByUserIdService(userId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
    getCateFollowByUserIdController
}
