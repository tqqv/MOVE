const express = require("express");
const channelRouter = express.Router();
const { verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { getCommentsByChannelIdController } = require("../controllers/commentController");
const { getListSubscribeOfChannel, subChannelController, getListSubscribeOfUser, getProfileChannelController, updateProfileChannelController, viewChannelController } = require("../controllers/channelController");


channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)

// unsub/sub
channelRouter.post("/subscribe", verifyUser, subChannelController)

//comment
channelRouter.get("/comments",  verifyStreamer, getCommentsByChannelIdController)
channelRouter.get("/getProfileChannel/:channelId", getProfileChannelController)
channelRouter.get("/viewChannel/:username", viewChannelController)

module.exports = channelRouter;
