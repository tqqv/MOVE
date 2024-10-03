const express = require("express");
const channelRouter = express.Router();
const { getListSubscribeOfChannel, followChannelController, getListSubscribeOfUser, getProfileChannelController, updateProfileChannelController, viewChannelController, getAllInforFollowController, searchVideoChannelController } = require("../controllers/channelController");
const { verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { getCommentsByChannelIdController } = require("../controllers/commentController");

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)

// unsub/sub
channelRouter.post("/followChannel", verifyUser, followChannelController)

channelRouter.get("/comments/:channelId",  verifyStreamer, getCommentsByChannelIdController)
channelRouter.get("/getProfileChannel/", verifyUser, getProfileChannelController)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)
channelRouter.get("/viewChannel/:username", viewChannelController)

channelRouter.get("/searchVideoChannel", searchVideoChannelController)
channelRouter.get("/getAllInforFollow", verifyUser, getAllInforFollowController)

module.exports = channelRouter;
