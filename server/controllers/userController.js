const responseHandler = require("../middlewares/responseHandler");
const { getProfile, editProfile, changePassword, requestChannel, getRequestStatusById, followChannel, listSubscribeOfUser, getAllInforFollow } = require("../services/userService");

const getProfileController = async (req, res, next) => {
  const userId = req.user.id;
  const result = await getProfile(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const editProfileController = async (req, res, next) => {
  const userId = req.user.id;
  const data = req.body;
  const result = await editProfile(userId, data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const changePasswordController = async (req, res, next) => {
  const userId = req.user.id;
  const data = req.body;
  const result = await changePassword(userId, data.oldPass, data.newPass, data.confirmPass)

  responseHandler(result.status, null, result.message)(req, res, next);
}

const requestChannelController = async (req, res, next) => {
  const userId = req.user.id;
  const result = await requestChannel(userId);

  responseHandler(result.status, null, result.message)(req, res, next);
}

const getRequestChannelController = async (req, res, next) => {
  const userId = req.user.id
  const result = await getRequestStatusById(userId);

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

const getAllInforFollowController = async(req, res, next) => {
  const userId = req.user.id;
  const result = await getAllInforFollow(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  getProfileController,
  changePasswordController,
  editProfileController,
  getRequestChannelController,
  requestChannelController,
  followChannelController,
  getListSubscribeOfUser,
  getAllInforFollowController,
}