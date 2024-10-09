const express = require("express");
const channelRouter = express.Router();
const { getListSubscribeOfChannel, getProfileChannelController, updateProfileChannelController, viewChannelController, searchVideoChannelController } = require("../controllers/channelController");
const { verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { getCommentsByChannelIdController } = require("../controllers/commentController");

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)


channelRouter.get("/comments/:channelId",  verifyStreamer, getCommentsByChannelIdController)
channelRouter.get("/getProfileChannel/", verifyUser, getProfileChannelController)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)
channelRouter.get("/viewChannel/:username", viewChannelController)

channelRouter.get("/searchVideoChannel", searchVideoChannelController)


module.exports = channelRouter;
