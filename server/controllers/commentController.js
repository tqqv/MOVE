const { query } = require("express");
const responseHandler = require("../middlewares/responseHandler");
var { createComment, getCommentsByVideo, getChildCommentsByParentId, getCommentsByChannelId } = require("../services/commentService");

const commentOnVideoController = async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.user.id;
  const commentResult = await createComment(videoId, userId, req.body);

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
  const videoComments = await getCommentsByVideo(videoId, page, pageSize);

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
  const videoComments = await getChildCommentsByParentId(parentId, page, pageSize);

  responseHandler(videoComments.status, videoComments.data, videoComments.message)(
    req,
    res,
    next
  );
};

const getCommentsByChannelIdController = async (req, res, next) => {
  const userId = req.user.id;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const comments = await getCommentsByChannelId(userId, page, pageSize);

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