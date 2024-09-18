const db = require("../models/index.js");
const { Comment, Video, User } = db;

const checkLevelAndGetParentId = async (parentId) => {
  // Tìm cha của comment được reply
  const parentCommentLevel1 = await Comment.findOne({ where: { id: parentId } });
  // Nếu không có cha thì trả về chính parentId input param
  if (!parentCommentLevel1.parentId) {
    return parentId;
  } else {
    // Nếu parent comment cũng có parentId, tức là level = 2 ( trong level 1 2 3 ), return parentId này
    const grandParentComment = await Comment.findOne({ where: { id: parentCommentLevel1.parentId } });
    if (grandParentComment && grandParentComment.parentId) {
      return grandParentComment.id;
    } else if(!grandParentComment.parentId) {
      return parentId
    }
  }
};

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

    // rechoice parent if exceed 2 level.
    commentInfor.parentId = await checkLevelAndGetParentId(commentInfor.parentId)

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
