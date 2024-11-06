const responseHandler = require("../middlewares/responseHandler");
const { reactionComment } = require('../services/reactionCommentService');

const reactionCommentController = async(req, res, next) => {
  const userId  = req.user.id;
  const commentId = req.body.commentId;
  const reactionType = req.body.reactionType;
  const result = await reactionComment(userId, commentId, reactionType);

  responseHandler(result.status, null, result.message)(req, res, next);
}

module.exports = {
  reactionCommentController,
}
