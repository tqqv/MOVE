const express = require("express");
const channelRouter = express.Router();
const { verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { getCommentsByChannelIdController } = require("../controllers/commentController");
const { getListSubscribeOfChannel, subChannelController, getListSubscribeOfUser, getProfileChannelController, updateProfileChannelController, viewChannelController, searchVideoChannelController } = require("../controllers/channelController");

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)

// unsub/sub
channelRouter.post("/subscribe", verifyUser, subChannelController)

channelRouter.get("/comments",  verifyStreamer, getCommentsByChannelIdController)
channelRouter.get("/getProfileChannel/", verifyUser, getProfileChannelController)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)
channelRouter.get("/viewChannel/:username", viewChannelController)

channelRouter.get("/searchVideoChannel", searchVideoChannelController)

module.exports = channelRouter;
