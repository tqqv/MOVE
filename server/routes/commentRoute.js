var express = require("express");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const { commentOnVideoController, getVideoCommentController } = require("../controllers/commentController");

const commentRouter = express.Router();
// commentRouter.post("/:videoId", verifyUser, commentOnVideoController);
commentRouter.get("/:videoId", getVideoCommentController);
commentRouter.post("/:videoId", commentOnVideoController);

module.exports = commentRouter;
