const db = require("../models/index.js");
const { Comment, Video, Category, User, Sequelize, LevelWorkout, Channel } = db;

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

const createComment = async (videoId, userId, channelId, commentInfor) => {
  try {
    // check exist video or not
    const videoChecker = await Video.findOne({ where: { id: videoId } });
    if (!videoChecker) {
      return {
        status: 404,
        message: "The video not found",
      };
    }

    // video not commentable
    if (!videoChecker.isCommentable) {
      return {
        status: 400,
        message: "The video is not commentable",
      };
    }

    // check no content
    if(!commentInfor.content) {
      return {
        status: 404,
        message: "The comment not found."
      }
    }

    const parentCommentChecker = await Comment.findOne({ where: { id: commentInfor.parentId || null }});
    // check parent comment is not null but also not a comment id. + check cả trường hợp fake parentId cmt
    if(commentInfor.parentId && !parentCommentChecker) {
      return {
        status: 404,
        message: "Parent comment id is not valid. Not null but also not a comment id."
      }
    }

    // exist parent && parent is not belong to post
    // if(parentCommentChecker && commentInfor.parentId && parentCommentChecker.videoId != videoId) {
    //   return {
    //     status: 400,
    //     message: "Parent comment's video does not match with input video id."
    //   }
    // }

    // Nếu parentId != null, thì phải kiểm tra để xem parent của nó là comment nào.
    commentInfor.parentId = !commentInfor.parentId  ? null : await checkLevelAndGetParentId(commentInfor.parentId)
    const comment = await Comment.create({videoId, userId, channelId, ...commentInfor})
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

const getCommentsByVideo = async (videoId, page, pageSize) => {

  const comments = await Comment.findAndCountAll({
    where: {
      parentId: null,
      videoId: videoId,
    },
    attributes: {
      include: [
        // Subquery để đếm số lượng bình luận con và cháu
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM move.comments AS replies
            WHERE replies.parentId = Comment.id
            OR replies.parentId IN (
              SELECT grandchild.id
              FROM move.comments AS grandchild
              WHERE grandchild.parentId = Comment.id
            )
          )`),
          'totalRepliesCount'
        ]
      ]
    },
    include: [
      {
        model: User, // Join User from Comment to get avatar, username, email
        as: 'userComments',
        attributes: ['avatar', 'username', 'email', 'isVerified']
      },
      {
        model: Channel,
        as: 'channelComments',
        attributes: ['avatar','channelName', 'popularCheck']
      },
    ],

    order: [
      ['updatedAt', 'ASC']
    ],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  })

  return {
    status: 200,
    data: {
      comments,
      totalPages: Math.ceil(comments.count/pageSize)
    
    },
    message: "Get comments success"
  }
}

const getCommentsByChannelId = async (userId, channelId, page, pageSize, responseCondition, sortCondition) => {
    let whereCondition = {
      parentId: null
    };
    if (responseCondition.isResponsed == "true") {
      whereCondition = {
        parentId: null,
        [Sequelize.Op.and]: Sequelize.literal(`
          EXISTS (
            SELECT 1
            FROM move.comments AS replies
            WHERE replies.parentId = Comment.id AND replies.userId = '${userId}'
          )
        `),
      };
    } else if (responseCondition.isResponsed == "false") {
    // Trả về các comment chưa được reply bởi userId
      whereCondition = {
        parentId: null,
        [Sequelize.Op.and]: Sequelize.literal(`
          NOT EXISTS (
            SELECT 1
            FROM move.comments AS replies
            WHERE replies.parentId = Comment.id AND replies.userId = '${userId}'
          )
        `),
      };
    }
  const commentsWithVideo = await Comment.findAll({
    where: whereCondition,
    attributes: {
      include: [
        // Subquery to count total replies (children and grandchildren comments)
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM move.comments AS replies
            WHERE replies.parentId = Comment.id
            OR replies.parentId IN (
              SELECT grandchild.id
              FROM move.comments AS grandchild
              WHERE grandchild.parentId = Comment.id
            )
          )`),
          'totalRepliesCount'
        ]
      ]
    },

    include: [
      {
        model: User,
        as: 'userComments',
        attributes: ['avatar', 'username', 'email']
      },
      {
        model: Channel,
        as: 'channelComments',
        attributes: ['avatar','channelName', 'popularCheck']
      },
      {
        model: Video,
        attributes: ['thumbnailUrl', 'title', 'duration', 'updatedAt'],
        where: {
          channelId: channelId,
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'title']
          },
          {
            model: LevelWorkout,
            as: 'levelWorkout',
            attributes: ['id', 'levelWorkout']
          }
        ]
      }
    ],
    order: [[sortCondition.sortBy, sortCondition.order]],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  });

  return {
    status: 200,
    data: commentsWithVideo,
    message: "Channel get comments by parent id success"
  }
}

const getChildCommentsByParentId = async (parentId, page, pageSize) => {
  const comments = await Comment.findAndCountAll({
    where: {
      parentId: parentId,
    },
    attributes: {
      include: [
        // Subquery để đếm số lượng bình luận con và cháu
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM move.comments AS replies
            WHERE replies.parentId = Comment.id
          )`),
          'totalRepliesCount'
        ]
      ]
    },
    include: [
      {
        model: User, // Join User from Comment to get avatar, username, email
        as: 'userComments',
        attributes: ['avatar', 'username', 'email', 'isVerified']
      },
      {
        model: Channel,
        as: 'channelComments',
        attributes: ['avatar','channelName', 'popularCheck']
      },
    ],
    order: [
      ['updatedAt', 'ASC']
    ],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  })

  return {
    status: 200,
    data: {
      comments,
      totalPages: Math.ceil(comments.count/pageSize)

    },
    message: "Get comments by parent id success"
  }
}

module.exports = {
    createComment,
    getCommentsByVideo,
    getChildCommentsByParentId,
    getCommentsByChannelId
}
