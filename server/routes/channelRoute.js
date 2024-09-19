const { getListSubscribeOfChannel, subChannelController, getListSubscribeOfUser } = require("../controllers/channelController");

const express = require("express");
const { verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { getCommentsByChannelId } = require("../services/commentService");
const { getCommentsByChannelIdController } = require("../controllers/commentController");
const channelRouter = express.Router();

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)

// unsub/sub
channelRouter.post("/subscribe", verifyUser, subChannelController)

//comment
channelRouter.get("/comments",  verifyStreamer, getCommentsByChannelIdController)

module.exports = channelRouter;
