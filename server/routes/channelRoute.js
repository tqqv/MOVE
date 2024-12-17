const express = require("express");
const channelRouter = express.Router();
const { getListSubscribeOfChannel, followChannelController, getListSubscribeOfUser, getProfileChannelController, updateProfileChannelController, viewChannelController, getAllInforFollowController, searchVideoChannelController, validateStreamKeyController, createStreamKeyController, endStreamController, overviewAnalyticController, getOBSStreamKeyController, generateNewOBSStreamKeyController } = require("../controllers/channelController");
const { verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { getCommentsByChannelIdController } = require("../controllers/commentController");
const { generateNewOBSStreamKey } = require("../services/channelService");

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)

channelRouter.get("/overview",  verifyStreamer, overviewAnalyticController)
channelRouter.get("/comments/:channelId",  verifyStreamer, getCommentsByChannelIdController)
channelRouter.get("/getProfileChannel/", verifyUser, getProfileChannelController)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)
channelRouter.get("/viewChannel/:username", viewChannelController)

channelRouter.get("/searchVideoChannel", searchVideoChannelController)


channelRouter.post("/validateStreamKey", validateStreamKeyController)
channelRouter.post("/endStream", endStreamController)
channelRouter.get("/createStreamKey", verifyStreamer, generateNewOBSStreamKeyController)
channelRouter.get("/getOBSStreamKey", verifyStreamer, getOBSStreamKeyController)

module.exports = channelRouter;
