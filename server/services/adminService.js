const { Op } = require("sequelize");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const { User, RequestChannel, Livestream, Video, Payment, Withdraw, Channel, sequelize, Report, Comment } = db;
const { createChannel, generatedStreamKey } = require("./channelService.js");
const moment = require('moment');

const setStatusRequestChannel = async(userId, status, text) => {
  console.log(status);
  try {
    if(!status || !userId) {
      return {
        status: 400,
        message: "Not null."
      }
    }
    if( status !== "approved" && status !== "rejected" ){
      return {
        status: 400,
        message: "Invalid status."
      }
    }
    const request = await RequestChannel.findOne({
      where: {
        userId: userId
      }
    })
    if(!request){
      return {
        status: 400,
        message: "Request not found."
      }
    }

    const user = await User.findByPk(userId);

    if(status === "approved") {
      const streamKey = await generatedStreamKey();
      const channel = await Channel.create({ userId, channelName: user.username, avatar: user.avatar, streamKey })
      if(!channel) {
        return {
            status: 400,
            data: channel,
            message: "Create channel failed."
        }
      }
      request.status = status;
      await request.save()
      user.role = "streamer";
      await user.save();
    }

    if(status === "rejected") {
      request.status = status;
      request.text = text;
      await request.save()
    }

    return {
      status: 200,
      message: "Updated status successfully."
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const getTotalMoneyEarnEveryMonth = async(year) => {
  try {
    if (!year || isNaN(year)) {
      year = new Date().getFullYear();
    }

    const whereCondition = {
      paymentStatus: "completed",
      createdAt: {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      }
    };

    const result = await Payment.findAll({
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalMoney'],
      ],
      where: whereCondition,
      group: [sequelize.literal('YEAR(createdAt)'), sequelize.literal('MONTH(createdAt)')],
      order: [[sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'], [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']],
    });

    return result

    // return {
    //   status: 200,
    //   data: result,
    //   message: "Get total money earn every month successful."
    // }
  } catch (error) {
    throw error;
  }
}

const getTotalMoneyWithdrawEveryMonth = async(year) => {
  try {
    if (!year || isNaN(year)) {
      year = new Date().getFullYear();
    }

    const whereCondition = {
      status: "completed",
      createdAt: {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      }
    };

    const result = await Withdraw.findAll({
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalMoney'],
      ],
      where: whereCondition,
      group: [sequelize.literal('YEAR(createdAt)'), sequelize.literal('MONTH(createdAt)')],
      order: [[sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'], [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']],
    });

    return result

    // return {
    //   status: 200,
    //   data: result,
    //   message: "Get total money withdraw every month successful."
    // }
  } catch (error) {
    throw error;
  }
}

const getStatistic = async () => {
  try {
    const [totalUser, totalVideo, totalStream, totalMoneyEarn, totalMoneyWithdraw] = await Promise.all([
      User.count(),
      Video.count(),
      Livestream.count(),
      Payment.sum('amount', { where: { paymentStatus: 'completed' } }),
      Withdraw.sum('amount', { where: { status: 'completed' } })
    ]);

    const revenue = (totalMoneyEarn * 0.7).toFixed(2);

    return {
      status: 200,
      data: {
        totalUser,
        totalVideo,
        totalStream,
        totalMoneyEarn,
        totalMoneyWithdraw,
        revenue
      },
      message: "Get statistic successful"
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
};

const getDataChartMoney = async(year) => {
  try {
    const moneyEarn = await getTotalMoneyEarnEveryMonth(year)
    const moneyWithdraw = await getTotalMoneyWithdrawEveryMonth(year)
    const revenue = moneyEarn.map(item => {
      const { year, month, totalMoney } = item.dataValues;
      return {
        year,
        month,
        totalMoney: (totalMoney * 0.7).toFixed(2)
      };
    });

    return {
      status: 200,
      data: {
        moneyEarn,
        moneyWithdraw,
        revenue
      },
      message: "Get data money chart successful."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const getTop5Channel = async() => {
  try {
    const top5Channel = await Channel.findAll({
      attributes: [
        'channelName',
        'rep',
        'avatar',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM videos
            WHERE videos.channelId = Channel.id
          )`),
          'totalVideos'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM livestreams
            WHERE livestreams.streamerId = Channel.id
          )`),
          'totalLivestreams'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM subscribes
            WHERE subscribes.channelId = Channel.id
          )`),
          'totalFollow'
        ],
        [
          sequelize.literal(`(
            SELECT COALESCE(SUM(rep), 0)
            FROM withdraws
            WHERE withdraws.channelId = Channel.id
          ) + Channel.rep`),
          'totalDonate'
        ]
      ],
      include: [{
        model: User,
        attributes: ['username']
      }],
      limit: 5,
      order: [['totalFollow', 'DESC']]
    });

    return {
      status: 200,
      data: top5Channel,
      message: "Get top 5 channel successful."
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const getTop5UserDeposit = async() => {
  try {
    const top5User = await User.findAll({
      attributes: [
        'username',
        'fullName',
        'avatar',
        [
          sequelize.literal(`(
            SELECT SUM(amount)
            FROM payments
            WHERE payments.userId = User.id
          )`),
          'totalDeposit'
        ]
      ],
      limit: 5,
      order: [['totalDeposit', 'DESC']]
    })

    return {
      status: 200,
      data: top5User,
      message: "Get top 5 user successful."
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const userCount = async() => {
  try {
    const user = await User.count({where: { role: "user" }})
    const streamer = await User.count({where: { role: "streamer" }})
    const admin = await User.count({where: { role: "admin" }})

    return {
      status: 200,
      data: {
        user,
        streamer,
        admin
      },
      message: "Get data user count successful."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const getAllUsersRequest = async (page, pageSize, sortCondition) => {
  try {
    const requestChannels = await RequestChannel.findAndCountAll({
      attributes: [
        'id', 'userId', 'status', 'text', 'createdAt', 'updatedAt',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM reports
            WHERE reports.targetCommentId IN (SELECT id FROM comments WHERE comments.id = RequestChannel.text)
            OR reports.targetAccountId = RequestChannel.userId
          )`),
          'totalReportCount'
        ]
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'avatar', 'phoneNumber', 'email', 'REPs', 'createdAt'],
          where: {
            isBanned: { [Op.ne]: true } 
          },
        }
      ],
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });
    return {
      status: 200,
      data: {
        data: requestChannels,
        totalPages: Math.ceil(requestChannels.count/pageSize)
      },
      message: "Fetched all request channels with user info and total report count successfully."
    };
  } catch (error) {
      return {
        status: 500,
        message: error.message || "Internal Server Error"
      };
    }
  };
module.exports = {
  setStatusRequestChannel,
  getStatistic,
  getDataChartMoney,
  getTop5Channel,
  getTop5UserDeposit,
  getAllUsersRequest,
  userCount,
}
