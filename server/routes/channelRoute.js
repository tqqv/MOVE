const { getListSubscribeOfChannel, subChannelController, getListSubscribeOfUser } = require("../controllers/channelController");

const express = require("express");
const { verifyUser } = require("../middlewares/verifyToken");
const channelRouter = express.Router();

channelRouter.get("/getListFollowed/:channelId", getListSubscribeOfChannel)
channelRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)

// unsub/sub
channelRouter.post("/subscribe", verifyUser, subChannelController)

module.exports = channelRouter;
