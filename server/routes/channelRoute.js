const express = require("express");
const channelRouter = express.Router();
const { getListSubscribeOfChannel, subChannelController, getListSubscribeOfUser, getProfileChannelController, updateProfileChannelController, viewChannelController, getAllInforFollowController, searchVideoChannelController } = require("../controllers/channelController");
const { verifyUser } = require("../middlewares/verifyToken");

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)

// unsub/sub
channelRouter.post("/subscribe", verifyUser, subChannelController)

channelRouter.get("/getProfileChannel/", verifyUser, getProfileChannelController)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)
channelRouter.get("/viewChannel/:username", viewChannelController)

channelRouter.get("/searchVideoChannel", searchVideoChannelController)
channelRouter.get("/getAllInforFollow", verifyUser, getAllInforFollowController)

module.exports = channelRouter;
