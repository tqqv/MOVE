const { query } = require("express");
const responseHandler = require("../middlewares/responseHandler");
var { createComment, getCommentsByVideo, getChildCommentsByParentId, getCommentsByChannelId } = require("../services/commentService");

const commentOnVideoController = async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.user.id;
  const channelId = req.user.channelId || null;
  const commentResult = await createComment(videoId, userId, channelId, req.body);

  responseHandler(commentResult.status, commentResult.data, commentResult.message)(
    req,
    res,
    next
  );
};

const getVideoCommentController = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const videoId = req.params.videoId;
  const userId = req.params.userId || null;
  const videoComments = await getCommentsByVideo(videoId, page, pageSize, userId);

  responseHandler(videoComments.status, videoComments.data, videoComments.message)(
    req,
    res,
    next
  );
};

const getChildCommentsByParentIdController = async (req, res, next) => {
  const parentId = req.query.parentId;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const userId = req.params.userId || null;
  const videoComments = await getChildCommentsByParentId(parentId, page, pageSize, userId);

  responseHandler(videoComments.status, videoComments.data, videoComments.message)(
    req,
    res,
    next
  );
};

const getCommentsByChannelIdController = async (req, res, next) => {
  const userId = req.user.id;
  const channelId = req.params.channelId;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const sortCondition = {
    sortBy: req.query.sortBy || 'updatedAt',
    order: req.query.order || 'desc'
  };
  const responseCondition = {
    isResponsed: req.query.isResponsed,
  };

  const comments = await getCommentsByChannelId(userId, channelId, page, pageSize, responseCondition, sortCondition);
  responseHandler(comments.status, comments.data, comments.message)(
    req,
    res,
    next
  );
};


module.exports = {
  commentOnVideoController,
  getVideoCommentController,
  getChildCommentsByParentIdController,
  getCommentsByChannelIdController
};
