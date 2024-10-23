const responseHandler = require("../middlewares/responseHandler");
const { reportVideo, reportLivestream, reportComment, reportChatMessages, getListReportByType } = require("../services/reportService");

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
  const result = await reportChatMessages(userId, content, reportTypeId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getListReportByTypeController = async(req, res, next) => {
  const type = req.query.type;
  const result = await getListReportByType(type);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  reportVideoController,
  reportLivestreamController,
  reportCommentController,
  reportChatMessagesController,
  getListReportByTypeController
}
