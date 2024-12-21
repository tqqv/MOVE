const responseHandler = require("../middlewares/responseHandler");
const { donateLivestream, getDonateByLivestreamId } = require("../services/donationService");

const donateLivestreamController = async(req, res, next) => {
  const userId = req.user.id;
  const donatorChannelId = req.user.channelId;
  const livestreamId = req.body.livestreamId;
  const donationItemId = req.body.donationItemId;
  const content = req.body.content;

  const result = await donateLivestream(userId, donatorChannelId, livestreamId, donationItemId, content);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getDonateByLivestreamIdController = async(req, res, next) => {
  const channelId = req.user.channelId;
  const livestreamId = req.params.livestreamId;

  const result = await getDonateByLivestreamId(channelId, livestreamId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  donateLivestreamController,
  getDonateByLivestreamIdController
}
