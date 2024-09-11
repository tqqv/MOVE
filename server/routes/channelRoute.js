const { get, getListSubscribe, subChannelController, unSubChannelController } = require("../controllers/channelController");

const express = require("express");
const { verifyUser } = require("../middlewares/verifyToken");
const channelRouter = express.Router();

channelRouter.get("/getListFollowed/:channelId", getListSubscribe)

// unsub/sub
channelRouter.post("/subcribe", verifyUser, subChannelController)
channelRouter.post("/subcribe", verifyUser, unSubChannelController)

module.exports = channelRouter;
