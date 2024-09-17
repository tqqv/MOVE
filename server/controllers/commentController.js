const { query } = require("express");
const responseHandler = require("../middlewares/responseHandler");
var { createComment, getVideoComments } = require("../services/commentService");

const commentOnVideoController = async (req, res, next) => {
  const videoId = req.params.videoId;
  // const userId = req.user.id;
  const commentResult = await createComment(videoId, 1, req.body);

  responseHandler(commentResult.status, commentResult.data, commentResult.message)(
    req,
    res,
    next
  );
};

const getVideoCommentController = async (req, res, next) => {
    const videoComments = await getVideoComments(req.body);

    responseHandler(videoComments.status, videoComments.data, videoComments.message)(
      req,
      res,
      next
    );
  };



module.exports = {
  commentOnVideoController,
  getVideoCommentController
};
