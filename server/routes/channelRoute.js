const express = require("express");
const channelRouter = express.Router();
const { getListSubscribeOfChannel, subChannelController, getListSubscribeOfUser, getProfileChannelController, updateProfileChannelController } = require("../controllers/channelController");
const { verifyUser } = require("../middlewares/verifyToken");

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)

// unsub/sub
channelRouter.post("/subscribe", verifyUser, subChannelController)

channelRouter.get("/getProfileChannel/:channelId", getProfileChannelController)
channelRouter.put("/editChannel", verifyUser, updateProfileChannelController)

module.exports = channelRouter;
