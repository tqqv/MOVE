var express = require("express");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const { commentOnVideoController, getVideoCommentController, getChildCommentsByParentIdController, getCommentsByChannelIdController } = require("../controllers/commentController");
const { reactionCommentController } = require("../controllers/reactionCommentController");

const commentRouter = express.Router();
commentRouter.post("/reactionComment", verifyUser, reactionCommentController)
commentRouter.post("/:videoId", verifyUser, commentOnVideoController);
// commentRouter.post("/:videoId", commentOnVideoController);
commentRouter.get("/:userId", getChildCommentsByParentIdController);
commentRouter.get("/:videoId/:userId", getVideoCommentController);

module.exports = commentRouter;
  