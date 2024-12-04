const responseHandler = require("../middlewares/responseHandler");
const { reportVideo, reportLivestream, reportComment, reportChatMessages, getListReportByType, reportChannel, getListReportVideo, getListReportComment, getListReportLivestream, getListReportAccount, getListReportChannel, actionReport } = require("../services/reportService");

const reportVideoController = async(req, res, next) => {
  const userId  = req.user.id;
  const videoId = req.body.videoId;
  const reportTypeId = req.body.reportTypeId;
  const result = await reportVideo(userId, videoId, reportTypeId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const reportLivestreamController = async(req, res, next) => {
  const userId  = req.user.id;
  const livestreamId = req.body.livestreamId;
  const reportTypeId = req.body.reportTypeId;
  const result = await reportLivestream(userId, livestreamId, reportTypeId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const reportCommentController = async(req, res, next) => {
  const userId  = req.user.id;
  const commentId = req.body.commentId;
  const reportTypeId = req.body.reportTypeId;
  const result = await reportComment(userId, commentId, reportTypeId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const reportChatMessagesController = async(req, res, next) => {
  const userId  = req.user.id;
  const content = req.body.content;
  const reportTypeId = req.body.reportTypeId;
  const accountId = req.body.accountId;
  const result = await reportChatMessages(userId, content, reportTypeId, accountId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportByTypeController = async(req, res, next) => {
  const type = req.query.type;
  const result = await getListReportByType(type);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const reportChannelController = async(req, res, next) => {
  const userId  = req.user.id;
  const channelId = req.body.channelId;
  const reportTypeId = req.body.reportTypeId;
  const result = await reportChannel(userId, channelId, reportTypeId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportVideoController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const result = await getListReportVideo(page, pageSize);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportCommentController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const result = await getListReportComment(page, pageSize);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportLivestreamController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const result = await getListReportLivestream(page, pageSize);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportAccountController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const result = await getListReportAccount(page, pageSize);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportChannelController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const result = await getListReportChannel(page, pageSize);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const actionReportController = async(req, res, next) => {
  const action = req.query.action;
  const result = await actionReport(action);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  reportVideoController,
  reportLivestreamController,
  reportCommentController,
  reportChatMessagesController,
  getListReportByTypeController,
  reportChannelController,
  getListReportVideoController,
  getListReportCommentController,
  getListReportLivestreamController,
  getListReportChannelController,
  getListReportAccountController,
  actionReportController,
}
