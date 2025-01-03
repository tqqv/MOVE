const { Op } = require("sequelize");
const db = require("../models/index.js");
const { messages } = require("../utils/redis/key/chatKey.js");
const { DonationItem, Report, ReportType, User, Video, Livestream, Comment, Channel, Ban, LevelWorkout, Category, Sequelize } = db;

const reportVideo = async(userId, videoId, reportTypeId) => {
  try {
    if (!userId || !videoId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkVideo = await Video.findOne({
      where: {
        id: videoId
      }
    })

    if(!checkVideo) {
      return {
        status: 404,
        data: null,
        message: "Video not found"
      }
    }

    const checkReport = await Report.findOne({
      where: {
        targetVideoId: videoId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this video"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetVideoId: videoId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportLivestream = async(userId, livestreamId, reportTypeId) => {
  try {
    if (!userId || !livestreamId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkLivestream = await Livestream.findOne({
      where: {
        id: livestreamId
      }
    })

    if(!checkLivestream) {
      return {
        status: 404,
        data: null,
        message: "Livestream not found"
      }
    }

    const checkReport = await Report.findOne({
      where: {
        targetLivestreamId: livestreamId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this livestream"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetLivestreamId: livestreamId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportComment = async(userId, commentId, reportTypeId) => {
  try {
    if (!userId || !commentId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkComment = await Comment.findOne({
      where: {
        id: commentId
      }
    })

    if(!checkComment) {
      return {
        status: 404,
        data: null,
        message: "Comment not found"
      }
    }

    const checkReport = await Report.findOne({
      where: {
        targetCommentId: commentId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this comment"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetCommentId: commentId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportChatMessages = async(userId, content, reportTypeId, accountId) => {
  try {
    if (!userId || !content || !reportTypeId  || !accountId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      chatMessagesContent: content,
      targetAccountId: accountId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportByType = async(type) => {
  try {
    const listReport = await ReportType.findAll({
      where: {
        type: type
      }
    })

    return {
      status: 200,
      data: listReport,
      message: `Get list report ${type} successfully.`
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportChannel = async(userId, channelId, reportTypeId) => {
  try {
    if (!userId || !channelId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkChannel = await Channel.findOne({
      where: {
        id: channelId
      }
    })

    if(!checkChannel) {
      return {
        status: 404,
        data: null,
        message: "Channel not found"
      }
    }

    const checkReport = await Report.findOne({
      where: {
        targetChannelId: channelId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this channel"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetChannelId: channelId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportAccount = async(userId, accountId, reportTypeId) => {
  try {
    if (!userId || !accountId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkAccount = await User.findOne({
      where: {
        id: accountId
      }
    })

    if(!checkAccount) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkReport = await Report.findOne({
      where: {
        targetAccountId: accountId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this account"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetAccountId: accountId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportVideo = async(page, pageSize, status) => {
  try {
    const whereCondition = {
      targetVideoId: {
        [Sequelize.Op.ne]: null,
      }
    }
    if(status) {
      if(status === "pending") {
        whereCondition.status = 'pending'
      } else if (status === 'banned') {
        whereCondition.status = 'banned'
      } else if (status === 'approved') {
        whereCondition.status = 'approved'
      } else if (status === 'rejected') {
        whereCondition.status = 'rejected'
      } else if (status === 'suspended') {
        whereCondition.status = 'suspended'
      } else if (status === 'closed') {
        whereCondition.status = 'closed'
      }
    }

    const listReportVideo = await Report.findAll({
      where: whereCondition,
      attributes: [
        'targetVideoId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetVideoId')), 'reportCount'],
      ],
      include: [
        {
          model: Video,
          attributes: ['title', 'thumbnailUrl'],
          include: {
            model: Channel,
            as: 'channel',
            attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
        }
      ],
      group: ['targetVideoId', 'status'],
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN Report.status = 'pending' THEN 0
              ELSE 1
            END
          `), 
          'ASC'
        ],
        [Sequelize.literal('reportCount'), 'DESC']
      ],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: whereCondition,
      attributes: [
          'status',
          'targetVideoId',
      ],
      group: ['targetVideoId', 'status'],
    })

    return {
      status: 200,
      data: {
        count: count.length,
        listReportVideo,
        totalPages: Math.ceil(count.length/pageSize)
      },
      message: "Get successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportComment = async(page, pageSize, status) => {
  try {
    const whereCondition = {
      targetCommentId: {
        [Sequelize.Op.ne]: null,
      }
    }
    if(status) {
      if(status === "pending") {
        whereCondition.status = 'pending'
      } else if (status === 'banned') {
        whereCondition.status = 'banned'
      } else if (status === 'approved') {
        whereCondition.status = 'approved'
      } else if (status === 'rejected') {
        whereCondition.status = 'rejected'
      } else if (status === 'suspended') {
        whereCondition.status = 'suspended'
      } else if (status === 'closed') {
        whereCondition.status = 'closed'
      }
    }
    const listReportComment = await Report.findAll({
      attributes: [
        'targetCommentId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetCommentId')), 'reportCount'],
      ],
      where: whereCondition,
      group: ['targetCommentId', 'status'],
      include: [
        {
          model: Comment,
          attributes: ['content', 'rep'],
          include: {
            model: User,
            as: 'userComments',
            attributes: ['avatar', 'username', 'email'],
            include: {
              model: Channel,
              attributes: ['channelName', 'avatar', 'isLive', 'popularCheck']
            }
          }
        }
      ],
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN status = 'pending' THEN 0
              ELSE 1
            END
          `), 
          'ASC'
        ],
        [Sequelize.literal('reportCount'), 'DESC']
      ],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: whereCondition,
      attributes: [
          'status',
          'targetCommentId',
      ],
      group: ['targetCommentId', 'status'],
    })

    return {
      status: 200,
      data: {
        count: count.length,
        listReportComment,
        totalPages: Math.ceil(count.length/pageSize)
      },
      message: "Get successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportLivestream = async(page, pageSize, status) => {
  try {
    const whereCondition = {
      targetLivestreamId: {
        [Sequelize.Op.ne]: null,
      }
    }
    if(status) {
      if(status === "pending") {
        whereCondition.status = 'pending'
      } else if (status === 'banned') {
        whereCondition.status = 'banned'
      } else if (status === 'approved') {
        whereCondition.status = 'approved'
      } else if (status === 'rejected') {
        whereCondition.status = 'rejected'
      } else if (status === 'suspended') {
        whereCondition.status = 'suspended'
      } else if (status === 'closed') {
        whereCondition.status = 'closed'
      }
    }

    const listReportLivestream = await Report.findAll({
      attributes: [
        'targetLivestreamId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetLivestreamId')), 'reportCount'],
      ],
      where: whereCondition,
      group: ['targetLivestreamId', 'status'],
      include: [
        {
          model: Livestream,
          attributes: ['thumbnailUrl', 'title'],
          include: {
            model: Channel,
            as: "livestreamChannel",
            attributes: ["channelName", "avatar", "popularCheck", "isLive"],
            include: {
              model: User,
              attributes: ["username"]
            }
          }
        }
      ],
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN status = 'pending' THEN 0
              ELSE 1
            END
          `), 
          'ASC'
        ],
        [Sequelize.literal('reportCount'), 'DESC']
      ],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: whereCondition,
      attributes: [
          'status',
          'targetLivestreamId',
      ],
      group: ['targetLivestreamId', 'status'],
    })

    return {
      status: 200,
      data: {
        count: count.length,
        listReportLivestream,
        totalPages: Math.ceil(count.length/pageSize)
      },
      message: "Get successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportAccount = async(page, pageSize, status) => {
  try {
    const whereCondition = {
      targetAccountId: {
        [Sequelize.Op.ne]: null,
      }
    }

    if(status) {
      if(status === "pending") {
        whereCondition.status = 'pending'
      } else if (status === 'banned') {
        whereCondition.status = 'banned'
      } else if (status === 'approved') {
        whereCondition.status = 'approved'
      } else if (status === 'rejected') {
        whereCondition.status = 'rejected'
      } else if (status === 'suspended') {
        whereCondition.status = 'suspended'
      } else if (status === 'closed') {
        whereCondition.status = 'closed'
      }
    }

    const listReportAccount = await Report.findAll({
      attributes: [
        'targetAccountId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetAccountId')), 'reportCount'],
      ],
      where: whereCondition,
      group: ['targetAccountId', 'status'],
      include: [
        {
          model: User,
          as: 'targetUser',
          attributes: ['username', 'avatar', 'id', 'email']
        }
      ],
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN status = 'pending' THEN 0
              ELSE 1
            END
          `), 
          'ASC'
        ],
        [Sequelize.literal('reportCount'), 'DESC']
      ],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: whereCondition,
      attributes: [
          'status',
          'targetAccountId',
      ],
      group: ['targetAccountId', 'status'],
    })

    return {
      status: 200,
      data: {
        count: count.length,
        listReportAccount,
        totalPages: Math.ceil(count.length/pageSize)
      },
      message: "Get successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportChannel = async(page, pageSize, status) => {
  try {
    const whereCondition = {
      targetChannelId: {
        [Sequelize.Op.ne]: null,
      }
    }

    if(status) {
      if(status === "pending") {
        whereCondition.status = 'pending'
      } else if (status === 'banned') {
        whereCondition.status = 'banned'
      } else if (status === 'approved') {
        whereCondition.status = 'approved'
      } else if (status === 'rejected') {
        whereCondition.status = 'rejected'
      } else if (status === 'suspended') {
        whereCondition.status = 'suspended'
      } else if (status === 'closed') {
        whereCondition.status = 'closed'
      }
    }

    const listReportChannel = await Report.findAll({
      attributes: [
        'targetChannelId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetChannelId')), 'reportCount'],
      ],
      where: whereCondition,
      group: ['targetChannelId', 'status'],
      include: [
        {
          model: Channel,
          attributes: ['channelName', 'avatar', 'id'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ],
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN status = 'pending' THEN 0
              ELSE 1
            END
          `), 
          'ASC'
        ],
        [Sequelize.literal('reportCount'), 'DESC']
      ],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: whereCondition,
      attributes: [
          'status',
          'targetChannelId',
      ],
      group: ['targetChannelId', 'status'],
    })

    return {
      status: 200,
      data: {
        count: count.length,
        listReportChannel,
        totalPages: Math.ceil(count.length/pageSize)
      },
      message: "Get successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const updateReportStatus = async(targetReportId, status, type) => {
  const whereCondition = {}

  if(type === 'account'){
    whereCondition.targetAccountId = targetReportId
  } else if (type === 'video') {
    whereCondition.targetVideoId = targetReportId
  } else if (type === 'livestream') {
    whereCondition.targetLivestreamId = targetReportId
  } else if (type === 'comment') {
    whereCondition.targetCommentId = targetReportId
  } else if (type === 'channel') {
    whereCondition.targetChannelId = targetReportId
  } else {
    throw Error('Type not exist')
  }

  await Report.update(
    { status },
    { where: whereCondition }
  );
};

const handleBan = async(banned, isPermanent = false) => {
  await Ban.create({
    userId: banned.userId,
    reason: banned.reason,
    expiresAt: isPermanent ? null : banned.expiresAt,
  });

  await User.update({ isBanned: true }, { where: { id: banned.userId } });

  const channel = await Channel.findOne({ where: { userId: banned.userId } });
  if (channel) {
    channel.isBanned = true;
    await channel.save();
    await hanleBanAllVideoAndStream(channel.id)
  }
  await hanleBanCommentByUserId(banned.userId)
};

const hanleBanAllVideoAndStream = async(channelId) => {
  await Video.update({ status: "private" }, { where: { channelId: channelId } })
  await Livestream.update({ isBanned: true }, { where: { streamerId: channelId } })
}

const hanleBanCommentByUserId = async(userId) => {
  await Comment.update({ isBanned: true }, { where: { userId: userId } })
}

const hanleBanSingleComment = async(commentId) => {
  await Comment.update({ isBanned: true }, { where: { id: commentId } })
}

const hanleBanSingleVideo = async(videoId) => {
  await Video.update({ isBanned: true }, { where: { id: videoId } })
}

const hanleBanSingleLivestream = async(livestreamId) => {
  await Livestream.update({ isBanned: true }, { where: { id: livestreamId } })
}

// const hanleBanCommentByChannelId = async(channelId) => {
//   await Video.update({ isBanned: true }, { where: { channelId: channelId } })
// }

const actionReport = async(targetReportId, action, banned, type) => {
  try {
    if (!action || !type) {
      return {
        status: 400,
        message: "Action and type cannot be empty.",
      };
    }

    switch (action) {
      case 'banned':
        if(!banned.userId || !banned.reason) {
          return {
            status: 400,
            message: "Id user and reason not null"
          }
        }

        const user = await User.findOne({where: {id:banned.userId}})

        if(!user) {
          return {
            status: 404,
            message: "User not found."
          }
        }

        await handleBan(banned, true);
        await updateReportStatus(targetReportId, 'banned', type);
        return {
          status: 200,
          message: `User associated resources have been permanently banned.`,
        };

      case 'rejected':
        await updateReportStatus(targetReportId, 'rejected', type);
        return {
          status: 200,
          message: "The report has been rejected.",
        };

      case 'suspended':
        if(!banned.userId || !banned.reason || !banned.expiresAt) {
          return {
            status: 400,
            message: "Id user, reason and exprires date not null"
          }
        }

        const userCheck = await User.findOne({where: {id:banned.userId}})

        if(!userCheck) {
          return {
            status: 404,
            message: "User not found."
          }
        }

        await handleBan(banned, false);
        await updateReportStatus(targetReportId, 'suspended', type);
        return {
          status: 200,
          message: ` User has been suspended until ${banned.expiresAt}.`,
        };

      case 'approved':
        if(!type) {
          return {
            status: 400,
            message: "Type cannot be empty.",
          }
        }

        switch (type) {
          case 'video':
            await updateReportStatus(targetReportId, 'approved', type);
            await hanleBanSingleVideo(targetReportId)
            return {
              status: 200,
              message: "The report has been approved.",
            };
          case 'livestream':
            await updateReportStatus(targetReportId, 'approved', type);
            await hanleBanSingleLivestream(targetReportId)

            return {
              status: 200,
              message: "The report has been approved.",
            };
          case 'comment':
            await updateReportStatus(targetReportId, 'approved', type);
            await hanleBanSingleComment(targetReportId)
            return {
              status: 200,
              message: "The report has been approved.",
            };
          default:
            return {
              status: 400,
              message: `Type "${type}" is invalid.`,
            };
        }
      case 'closed':
        await updateReportStatus(targetReportId, 'closed', type);
        return {
          status: 200,
          message: "The report has been closed.",
        };

      default:
        return {
          status: 400,
          message: `Action "${action}" is invalid.`,
        };
    }
  } catch (error) {
    return {
      status: 500,
      message: `An error occurred: ${error.message}`,
    };
  }
};

const getReportDetail = async(targetReportId, type) => {
  try {
    let whereCondition = {};
    if (!type) {
      return {
        status: 400,
        message: "Type cannot be empty.",
      };
    }
    switch (type) {
      case 'video':
        whereCondition.targetVideoId = targetReportId;
        const reportVideoDetail = await Report.findOne({
          where: whereCondition,
          include: [
            {
              model: Video,
              include: [
                {
                  model: Channel,
                  as: 'channel',
                  attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
                  include: {
                    model: User,
                    attributes: ['username', 'id', 'role']
                  }
                },
                {
                  model: LevelWorkout,
                  attributes: ['levelWorkout'],
                  as: "levelWorkout",
                },
                {
                  model: Category,
                  attributes: ['title'],
                  as: 'category',
                }
              ]
            },
          ]
        })

        const videoReporters = await Report.findAll({
          where: {targetVideoId: targetReportId},
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'reporter',
              attributes: ['username', 'avatar', 'role', 'email', 'id']
            },
            {
              model: ReportType,
              attributes: ['description']
            }
          ]
        })
        return {
          status: 200,
          data: {reportVideoDetail , videoReporters},
          message: 'Get report video detail successful.'
        }
      case 'livestream':
        whereCondition.targetLivestreamId = targetReportId;
        const reportLivestreamDetail = await Report.findOne({
          where: whereCondition,
          include: [
            {
              model: Livestream,
              include: [
                {
                  model: Channel,
                  as: 'livestreamChannel',
                  attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
                  include: {
                    model: User,
                    attributes: ['username', 'id', 'role']
                  }
                },
                {
                  model: Category,
                  attributes: ["title"],
                  as: 'category'
                },
                {
                  model: LevelWorkout,
                  attributes: ["levelWorkout"],
                  as: 'livestreamLevelWorkout'
                },
              ]
            }
          ]
        })
        const streamReporters = await Report.findAll({
          where: {targetLivestreamId: targetReportId},
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'reporter',
              attributes: ['username', 'avatar', 'role', 'email', 'id']
            },
            {
              model: ReportType,
              attributes: ['description']
            }
          ]
        })
        return {
          status: 200,
          data: {reportLivestreamDetail, streamReporters},
          message: 'Get report stream detail successful.'
        }

      case 'comment':
        whereCondition.targetCommentId = targetReportId;
        const reportCommentDetail = await Report.findOne({
          where: whereCondition,
          include: [
            {
              model: Comment,
              include: [
                {
                  model: Video,
                  include: [
                    {
                      model: Channel,
                      as: 'channel',
                      attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
                      include: {
                        model: User,
                        attributes: ['username', 'id'] 
                      }
                    },
                    {
                      model: LevelWorkout,
                      attributes: ['levelWorkout'],
                      as: "levelWorkout",
                    },
                    {
                      model: Category,
                      attributes: ['title'],
                      as: 'category',
                    }
                  ]
                },
                {
                  model: User,
                  as: 'userComments',
                  attributes: ['avatar', 'username', 'email', 'isVerified', 'role']
                },
                {
                  model: Channel,
                  as: 'channelComments',
                  attributes: ['avatar','channelName', 'popularCheck']
                },
                {
                  model: DonationItem,
                  as: 'commentDonationItem',
                  attributes: ['name', 'image']
                },
              ]
            }
          ],
        })

        const commentReporters = await Report.findAll({
          where: {targetCommentId: targetReportId},
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'reporter',
              attributes: ['username', 'avatar', 'role', 'email', 'id']
            },
            {
              model: ReportType,
              attributes: ['description']
            }
          ]
        })
        return {
          status: 200,
          data: {reportCommentDetail, commentReporters},
          message: 'Get report comment detail successful.'
        }
      case 'account':
        whereCondition.targetAccountId = targetReportId;
        const reportAccountDetail = await Report.findOne({
          where: whereCondition,
          include: [
            {
              model: User,
              as: 'targetUser',
              attributes:  ['username', 'avatar','fullName', 'dob','gender', 'email', 'country', 'city', 'state', 'id', 'role'],
            }
          ]
        })

        const accountReporters = await Report.findAll({
          where: {targetAccountId: targetReportId},
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'reporter',
              attributes: ['username', 'avatar', 'role', 'email', 'id']
            },
            {
              model: ReportType,
              attributes: ['description']
            }
          ]
        })

        return {
          status: 200,
          data: {reportAccountDetail, accountReporters},
          message: 'Get report account detail successful.'
        }
      case 'channel':
        whereCondition.targetChannelId = targetReportId;
        const reportChannelDetail = await Report.findOne({
          where: whereCondition,
          include: [
            {
              model: Channel,
              attributes: ['avatar','channelName','bio','facebookUrl' ,'youtubeUrl','instaUrl'],
              include: {
                model: User,
                attributes: ['username', 'avatar','fullName', 'dob','gender', 'email', 'country', 'city', 'state', 'id', 'role'],
              }
            }
          ]
        })

        const channelReporters = await Report.findAll({
          where: {targetChannelId: targetReportId},
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'reporter',
              attributes: ['username', 'avatar', 'role', 'email', 'id']
            },
            {
              model: ReportType,
              attributes: ['description']
            }
          ]
        })
        return {
          status: 200,
          data: {reportChannelDetail, channelReporters},
          message: 'Get report channel detail successful.'
        }
      default:
        return {
          status: 400,
          message: `Type "${type}" is invalid.`,
        };
    }
  } catch (error) {
    return {
      status: 500,
      message: `An error occurred: ${error.message}`,
    };
  }
}

module.exports = {
  reportVideo,
  reportLivestream,
  reportComment,
  reportChatMessages,
  getListReportByType,
  reportChannel,
  reportAccount,
  getListReportVideo,
  getListReportComment,
  getListReportLivestream,
  getListReportAccount,
  getListReportChannel,
  actionReport,
  getReportDetail
}
