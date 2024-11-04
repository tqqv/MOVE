const db = require("../models/index.js");
const { CommentReaction, Comment, User} = db;

const reactionComment = async(userId, commentId, reactionType) => {
  try {
    const user = await User.findByPk(userId);
    if(!user) {
      return {
        status: 404,
        message: "User not found."
      }
    }

    const comment = await Comment.findByPk(commentId);
    if(!comment) {
      return {
        status: 404,
        message: "User not found."
      }
    }

    const reactComment = await CommentReaction.findOne({
      where: {
        userId: userId,
        commentId: commentId
      }
    });

    if(!reactComment) {
      await CommentReaction.create({
        userId: userId,
        commentId: commentId,
        reactionType: reactionType
      })

      return {
        status: 200,
        message: "Like comment successfully."
      }
    }

    if(reactComment && reactComment.reactionType !== reactionType ) {
      if(reactionType === "like"){
        reactComment.reactionType = "like"
        await reactComment.save()

        return {
          status: 200,
          message: "Updated successfully.."
        }
      }else {
        reactComment.reactionType = "dislike"
        await reactComment.save()

        return {
          status: 200,
          message: "Updated successfully."
        }
      }
    }

    if(reactComment && reactComment.reactionType === reactionType) {
      await reactComment.destroy()
      return {
        status: 200,
        message: "Canneled."
      }
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

module.exports = {
  reactionComment,
}
