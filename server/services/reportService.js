const { Op } = require("sequelize");
const db = require("../models/index.js");
const { Report, ReportType, User, Video, Livestream, Comment, Channel, Ban, Sequelize } = db;

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

const getListReportVideo = async(page, pageSize) => {
  try {
    const listReportVideo = await Report.findAll({
      attributes: [
        'targetVideoId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetVideoId')), 'reportCount'],
      ],
      where: {
        targetVideoId: {
          [Sequelize.Op.ne]: null,
        }
      },
      group: ['targetVideoId', 'status'],
      include: [
        {
          model: Video,
          attributes: ['title', 'thumbnailUrl']
        }
      ],
      order: [[Sequelize.literal('reportCount'), 'DESC']],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: {
        targetVideoId: {
          [Sequelize.Op.ne]: null,
        }
      },
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

const getListReportComment = async(page, pageSize) => {
  try {
    const listReportComment = await Report.findAll({
      attributes: [
        'targetCommentId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetCommentId')), 'reportCount'],
      ],
      where: {
        targetCommentId: {
          [Sequelize.Op.ne]: null,
        }
      },
      group: ['targetCommentId', 'status'],
      include: [
        {
          model: Comment,
          attributes: ['content', 'rep']
        }
      ],
      order: [[Sequelize.literal('reportCount'), 'DESC']],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: {
        targetCommentId: {
          [Sequelize.Op.ne]: null,
        }
      },
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

const getListReportLivestream = async(page, pageSize) => {
  try {
    const listReportLivestream = await Report.findAll({
      attributes: [
        'targetLivestreamId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetLivestreamId')), 'reportCount'],
      ],
      where: {
        targetLivestreamId: {
          [Sequelize.Op.ne]: null,
        }
      },
      group: ['targetLivestreamId', 'status'],
      include: [
        {
          model: Livestream,
          attributes: ['content', 'rep']
        }
      ],
      order: [[Sequelize.literal('reportCount'), 'DESC']],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: {
        targetLivestreamId: {
          [Sequelize.Op.ne]: null,
        }
      },
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

const getListReportAccount = async(page, pageSize) => {
  try {
    const listReportAccount = await Report.findAll({
      attributes: [
        'targetAccountId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetAccountId')), 'reportCount'],
      ],
      where: {
        targetAccountId: {
          [Sequelize.Op.ne]: null,
        }
      },
      group: ['targetAccountId', 'status'],
      include: [
        {
          model: User,
          attributes: ['username', 'avatar', 'id']
        }
      ],
      order: [[Sequelize.literal('reportCount'), 'DESC']],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: {
        targetAccountId: {
          [Sequelize.Op.ne]: null,
        }
      },
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

const getListReportChannel = async(page, pageSize) => {
  try {
    const listReportChannel = await Report.findAll({
      attributes: [
        'targetChannelId',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('targetChannelId')), 'reportCount'],
      ],
      where: {
        targetChannelId: {
          [Sequelize.Op.ne]: null,
        }
      },
      group: ['targetChannelId', 'status'],
      include: [
        {
          model: Channel,
          attributes: ['channelName', 'avatar', 'id']
        }
      ],
      order: [[Sequelize.literal('reportCount'), 'DESC']],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    });

    const count = await Report.count({
      where: {
        targetChannelId: {
          [Sequelize.Op.ne]: null,
        }
      },
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

const updateReportStatus = async(reportId, status) => {
  await Report.update(
    { status },
    { where: { id: reportId } }
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
  await Video.update({ isBanned: true }, { where: { channelId: channelId } })
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
  await Comment.update({ isBanned: true }, { where: { id: livestreamId } })
}

// const hanleBanCommentByChannelId = async(channelId) => {
//   await Video.update({ isBanned: true }, { where: { channelId: channelId } })
// }

const actionReport = async(reportId, action, banned, type) => {
  try {
    if (!action) {
      return {
        status: 400,
        message: "Action cannot be empty.",
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

        await handleBan(banned, true);
        await updateReportStatus(reportId, 'banned');
        return {
          status: 200,
          message: `User associated resources have been permanently banned.`,
        };

      case 'rejected':
        await updateReportStatus(reportId, 'rejected');
        return {
          status: 200,
          message: "The report has been rejected.",
        };

      case 'suspended':
        if(!banned.userId || !banned.reason || !banned.expiresAt) {
          return {
            status: 400,
            message: "Id user and reason not null"
          }
        }
        await handleBan(banned, false);
        await updateReportStatus(reportId, 'suspended');
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

        const report = await Report.findByPk(reportId)

        switch (type) {
          case 'video':
            await updateReportStatus(reportId, 'approved');
            await hanleBanSingleVideo(report.targetVideoId)
            return {
              status: 200,
              message: "The report has been approved.",
            };
          case 'livestream':
            await updateReportStatus(reportId, 'approved');
            await hanleBanSingleLivestream(report.targetLivestreamId)

            return {
              status: 200,
              message: "The report has been approved.",
            };
          case 'comment':
            await updateReportStatus(reportId, 'approved');
            await hanleBanSingleComment(report.targetCommentId)
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
        await updateReportStatus(reportId, 'closed');
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




module.exports = {
  reportVideo,
  reportLivestream,
  reportComment,
  reportChatMessages,
  getListReportByType,
  reportChannel,
  getListReportVideo,
  getListReportComment,
  getListReportLivestream,
  getListReportAccount,
  getListReportChannel,
  actionReport
}
