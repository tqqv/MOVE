const responseHandler = require("../middlewares/responseHandler");
const { subscribeChannel, listSubscribeOfChannel, listSubscribeOfUser, getProfileChannel, editProfileChannel, viewChannel } = require("../services/channelService");



const getListSubscribeOfChannel = async(req, res, next) => {
    const channelId = req.params.channelId;
    // console.log(channelId);

    const result = await listSubscribeOfChannel(channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const subChannelController = async(req, res, next) => {
    const userId = req.user.id;
    const channelId = req.body.channelId;
    const result = await subscribeChannel(userId, channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListSubscribeOfUser = async(req, res, next) => {
    const userId = req.user.id;
    const result = await listSubscribeOfUser(userId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getProfileChannelController = async(req, res, next) => {
    const channelId = req.params.channelId;
    const result = await getProfileChannel(channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const updateProfileChannelController = async(req, res, next) => {
    const userId = req.user.id;
    const { username, ...data } = req.body;
    const result = await editProfileChannel(userId, data, username);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const viewChannelController = async(req, res, next) => {
    const channelId = req.params.channelId;
    const result = await viewChannel(channelId);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
    getListSubscribeOfChannel,
    subChannelController,
    getListSubscribeOfUser,
    getProfileChannelController,
    updateProfileChannelController,
    viewChannelController
}
