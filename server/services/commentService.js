const db = require("../models/index.js");
const { Comment, Video, User } = db;

const createComment = async (videoId, userId, commentInfor) => {
  try {
    // check exist video or not
    const videoChecker = await Video.findOne({ where: { id: videoId } });
    if (!videoChecker) {
      return {
        status: 404,
        message: "The video not found",
      };
    }

    // check no content
    if(!commentInfor.content) {
      return {
        status: 404,
        message: "The comment not found."
      }
    }

    const parentCommentChecker = await Comment.findOne({ where: { id: commentInfor.parentId }});
    // check parent comment is not null but also not a comment id.
    if(commentInfor.parentId && !parentCommentChecker) {
      return {
        status: 404,
        message: "Parent comment id is not valid. Not null but also not a comment."
      }
    }

    // exist parent && parent is not belong to post
    if(parentCommentChecker && commentInfor.parentId && parentCommentChecker.videoId != videoId) {
      return {
        status: 400,
        message: "Parent comment's video does not match with input video id."
      }
    }

    const comment = await Comment.create({videoId, userId, ...commentInfor})
    if(!comment) {
        return {
            status: 400,
            data: comment,
            message: "Create comment failed."
        }
    }

    return {
        status: 200,
        data: comment,
        message: "Create comment successfully."
    }
  } catch (error) {
    return {
        status: 400,
        data: null,
        message: error.message
    }
  }
}

const getVideoComments = async () => {
}

const getChildCommentByCommentId = async () => {
}
module.exports = {
    createComment,
    getVideoComments
}
