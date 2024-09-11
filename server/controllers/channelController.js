const responseHandler = require("../middlewares/responseHandler");
const { listSubscribe, subscribeChannel, unSubscribeChannel } = require("../services/channelService");



const getListSubscribe = async(req, res, next) => {
    const channelId = req.params.channelId;
    console.log(channelId);

    const result = await listSubscribe(channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const subChannelController = async(req, res, next) => {
    const userId = req.user.userId;
    const channelId = req.body;
    const result = await subscribeChannel(userId, channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const unSubChannelController = async(req, res, next) => {
    const userId = req.user.userId;
    const channelId = req.body;
    const result = await unSubscribeChannel(userId, channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
    getListSubscribe,
    subChannelController,
    unSubChannelController
}
