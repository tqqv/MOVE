const db = require("../models/index.js");
const { Comment, Video, Category, User, Sequelize } = db;

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

    const parentCommentChecker = await Comment.findOne({ where: { id: commentInfor.parentId || null }});
    // check parent comment is not null but also not a comment id. + check cả trường hợp fake parentId cmt
    if(commentInfor.parentId && !parentCommentChecker) {
      return {
        status: 404,
        message: "Parent comment id is not valid. Not null but also not a comment id."
      }
    }

    // exist parent && parent is not belong to post
    if(parentCommentChecker && commentInfor.parentId && parentCommentChecker.videoId != videoId) {
      return {
        status: 400,
        message: "Parent comment's video does not match with input video id."
      }
    }

    // Nếu parentId != null, thì phải kiểm tra để xem parent của nó là comment nào.
    commentInfor.parentId = !commentInfor.parentId  ? null : await checkLevelAndGetParentId(commentInfor.parentId)
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

const getCommentsByVideo = async (videoId, page, pageSize) => {

  const comments = await Comment.findAll({
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
        model: User, // Include bảng User
        as: 'userComments',
        attributes: ['avatar', 'REPs', 'username'], // Chỉ lấy các field cần thiết
      }
    ],
    order: [
      ['updatedAt', 'ASC']
    ],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  })

  return {
    status: 200,
    data: comments,
    message: "Get comments success"
  }
}
const getCommentsByChannelId = async (userId, page, pageSize) => {
  const commentsWithVideo = await Video.findAll({
    where: {
      userId: userId, // Lọc Video theo userId
    },
    attributes: ['thumbnailUrl', 'title', 'updatedAt'], // Lấy các thuộc tính từ Video
    include: [
      {
        model: Comment, // Join với Comment
        where: {
          parentId: null,
        },
        attributes: {
          include: [
            // Subquery để đếm số lượng bình luận con và cháu
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM move.comments AS replies
                WHERE replies.parentId = Comments.id
                OR replies.parentId IN (
                  SELECT grandchild.id
                  FROM move.comments AS grandchild
                  WHERE grandchild.parentId = Comments.id
                )
              )`),
              'totalRepliesCount'
            ]
          ]
        },
        required: true, // Chỉ lấy Video có comment
        include: [
          {
            model: Comment, // Join tiếp với các bình luận con (có thể không cần thiết nếu chỉ cần đếm)
            as: 'replies',
            attributes: [],
          },
          {
            model: User, // Include bảng User cho người comment
            as: 'userComments', // Alias cho mối quan hệ qua Comment
            attributes: ['avatar', 'REPs', 'username'], // Chỉ lấy các field cần thiết
          }
        ]
      },
      {
        model: Category, // Join với Category để lấy tên danh mục
        attributes: ['id', 'title'],
        as: 'category',
      },
    ],
    order: [
      ['updatedAt', 'ASC']
    ],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  });

  return {
    status: 200,
    data: commentsWithVideo,
    message: "Get comments by channel ID success"
  };
};

const getChildCommentsByParentId = async (parentId, page, pageSize) => {
  const comments = await Comment.findAll({
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
        model: User, // Include bảng User
        as: 'userComments',
        attributes: ['avatar', 'REPs', 'username'], // Chỉ lấy các field cần thiết
      }
    ],
    order: [
      ['updatedAt', 'ASC']
    ],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  })

  return {
    status: 200,
    data: comments,
    message: "Get comments by parent id success"
  }
}

module.exports = {
    createComment,
    getCommentsByVideo,
    getChildCommentsByParentId,
    getCommentsByChannelId
}
