const responseHandler = require("../middlewares/responseHandler");
const { followChannel, listSubscribeOfChannel, listSubscribeOfUser, getProfileChannel, editProfileChannel, viewChannel, searchVideoChannel, getAllInforFollow, createStreamKey, validateStreamKey, endStream, overviewAnalytic, generateNewOBSStreamKey, getOBSStreamKey } = require("../services/channelService");



const getListSubscribeOfChannel = async(req, res, next) => {
  const channelId = req.params.channelId;
  // console.log(channelId);

  const result = await listSubscribeOfChannel(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const followChannelController = async(req, res, next) => {
  const userId = req.user.id;
  const channelId = req.body.channelId;
  const result = await followChannel(userId, channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListSubscribeOfUser = async(req, res, next) => {
  const userId = req.user.id;
  const result = await listSubscribeOfUser(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getProfileChannelController = async(req, res, next) => {
  const userId = req.user.id;
  const result = await getProfileChannel(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const updateProfileChannelController = async(req, res, next) => {
  const userId = req.user.id;
  const { username, ...data } = req.body;
  const result = await editProfileChannel(userId, data, username);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const viewChannelController = async(req, res, next) => {
  const username = req.params.username;
  const result = await viewChannel(username);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const searchVideoChannelController = async(req, res, next) => {
  const data = req.query.data
  const limit = req.query.limit || 5
  const offset = req.query.offset || 0
  const result = await searchVideoChannel(data, limit, offset)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllInforFollowController = async(req, res, next) => {
  const userId = req.user.id;
  const result = await getAllInforFollow(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const createStreamKeyController = async(req, res, next) => {
  const channelId = req.user.channelId;
  const result = await createStreamKey(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getOBSStreamKeyController = async(req, res, next) => {
  const channelId = req.user.channelId;
  const result = await getOBSStreamKey(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const generateNewOBSStreamKeyController = async(req, res, next) => {
  const channelId = req.user.channelId;
  const result = await generateNewOBSStreamKey(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const validateStreamKeyController = async(req, res, next) => {
  const streamKey = req.body.streamKey;
  const result = await validateStreamKey(streamKey);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const endStreamController = async(req, res, next) => {
  const data = req.body;
  const result = await endStream(data);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const overviewAnalyticController = async(req, res, next) => {
  const channelId = req.user.channelId;
  const result = await overviewAnalytic(channelId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  getListSubscribeOfChannel,
  followChannelController,
  getListSubscribeOfUser,
  getProfileChannelController,
  updateProfileChannelController,
  viewChannelController,
  searchVideoChannelController,
  getAllInforFollowController,
  createStreamKeyController,
  validateStreamKeyController,
  endStreamController,
  overviewAnalyticController,
  getOBSStreamKeyController,
  generateNewOBSStreamKeyController
}
