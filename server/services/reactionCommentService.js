const db = require("../models/index.js");
const { createNotification } = require("./notificationService.js");
const { ReactionComment, Comment, User, Channel} = db;

const reactionComment = async(userId, commentId, reactionType) => {
  try {
    const user = await User.findByPk(userId);
    const channel = await Channel.findOne({where: {
      userId
    }})

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

    const reactComment = await ReactionComment.findOne({
      where: {
        userId: userId,
        commentId: commentId
      }
    });

    if(!reactComment) {
      await ReactionComment.create({
        userId: userId,
        commentId: commentId,
        reactionType: reactionType
      })
      await createNotification(
        "comment",
        "reaction",
        (channel ? null: userId),
        (channel ? channel.id : null),
        comment.channelId || comment.userId,
        comment.id,
        comment.videoId
      )
      return {
        status: 200,
        message: reactionType === 'like' ? "Like comment successfully." : "Dislike comment successfully."
      }
    }

    if(reactComment && reactComment.reactionType !== reactionType ) {
      if(reactionType === "like"){
        reactComment.reactionType = "like"
        await reactComment.save()

        return {
          status: 200,
          message: "Updated to like successfully."
        }
      }else {
        reactComment.reactionType = "dislike"
        await reactComment.save()

        return {
          status: 200,
          message: "Updated to dislike successfully."
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
