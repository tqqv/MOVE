const { Op } = require("sequelize");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const validateUsername = require("../middlewares/validateUsername.js");
const { User, RequestChannel, Livestream, Video, Payment, Withdraw, Channel, sequelize, Report, Comment } = db;
const { createChannel, generatedStreamKey } = require("./channelService.js");
const validateUsername = require("../middlewares/validateUsername.js");

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
      message: error.message || "Internal Server Error"
    };
  }
}

const getStartAndEndOfYear = (year) => {
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
  return { startOfYear, endOfYear };
};

const getTotalMoneyEarnEveryMonth = async(year) => {
  try {
    if (!year || isNaN(year)) {
      year = new Date().getFullYear();
    }

    const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

    const whereCondition = {
      paymentStatus: "completed",
      createdAt: {
        [Op.between]: [startOfYear, endOfYear],
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

    const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

    const whereCondition = {
      status: "completed",
      createdAt: {
        [Op.between]: [startOfYear, endOfYear],
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

    const revenue = (totalMoneyEarn - totalMoneyWithdraw).toFixed(0); // hiiiii221

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
    const withdrawMap = new Map();
    moneyWithdraw.forEach(item => {
      const { year, month, totalMoney } = item.dataValues;
      withdrawMap.set(`${year}-${month}`, totalMoney);
    });

    // Tính toán totalMoney
    const revenue = moneyEarn.map(item => {
      const { year, month, totalMoney } = item.dataValues;
      const totalWithdrawn = withdrawMap.get(`${year}-${month}`) || 0; // Nếu không có trong moneyWithdraw, dùng 0
      return {
        year,
        month,
        totalMoney: totalMoney - totalWithdrawn // Trừ tiền đã rút
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

const unbanAccount = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId, isBanned: true },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found or user is not banned",
      };
    }

    await Promise.all([
      user.update({ isBanned: false }),
      Ban.destroy({ where: { userId } }),
    ]);

    return {
      status: 200,
      message: "Unban user successful.",
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const unbanChannel = async(channelId) => {
  try {
    const channel = await Channel.fineOne({where: {id: channelId, isBanned: true}})
    if(!channel) {
      return {
        status: 404,
        message: "Channel not found or channel is not banned"
      }
    }
    channel.isBanned = false;
    await channel.save();

    return {
      status: 200,
      message: "Unban channel successful."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const getAllUsersRequest = async (page, pageSize, status, sortCondition) => {
  try {
    const whereCondition = {
      ...(status && { status }),
    };
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
          attributes: ['id', 'username', 'avatar', 'email', 'REPs', 'createdAt'],
          where: {
            isBanned: { [Op.ne]: true }
          },
        }
      ],
      where: whereCondition,
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

const getAllUser = async(page, pageSize, sortCondition) => {
  try {
    const listUser = await User.findAndCountAll({
      attributes: [
        'id', 'fullName', 'referralCode', 'REPs', 'username', 'role', 'email', 'createdAt', 'isBanned', 'isVerified', 'avatar'
      ],
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: {
        data: listUser,
        totalPages: Math.ceil(listUser.count/pageSize)
      },
      message: "Fetched all request channels with user info and total report count successfully."
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const editProfileUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if(!user){
      return {
        status: 400,
        data: null,
        message: "User not found"
      }
    }

    if(user.email && user.isVerified && data.email) {
      return {
        status: 400,
        data: null,
        message: "You can't change verified email"
      }
    }

    if(data.username){
      if (data.username.length < 3 || data.username.length > 32 ||  /[A-Z]/.test(data.username)) {
        return {
          status: 400,
          data: null,
          message: "Must be between 3 and 32 in length and cannot contain uppercase letters."
        }
      } else if (!validateUsername(data.username)) {
        return {
          status: 400,
          data: null,
          message: "Please only use numbers, letters, underscores or periods."
        }
      }

      const user = await User.findOne({where: {username: data.username}})
      if(user) {
        return {
          status: 400,
          data: null,
          message: "Username already exists."
        }
      }
    }

    const updateUser = await user.update(data)
    if(!updateUser) {
      return {
        status: 400,
        data: null,
        message: "Update failed."
      }
    }

    return {
      status: 200,
      data: updateUser,
      message: "Update successfully."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error"
    };
  }
}

const revenue = async (year) => {
  try {
    const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

    const [moneyEarn, moneyWithdraw, totalPayment, totalWithdraw] = await Promise.all([
      getTotalMoneyEarnEveryMonth(year),
      getTotalMoneyWithdrawEveryMonth(year),
      Payment.sum('amount', {
        where: {
          paymentStatus: 'completed',
          createdAt: {
            [Op.between]: [startOfYear, endOfYear],
          },
        },
      }),
      Withdraw.sum('amount', {
        where: {
          status: 'completed',
          createdAt: {
            [Op.between]: [startOfYear, endOfYear],
          },
        },
      }),
    ]);

    return {
      status: 200,
      data: {
        moneyEarn,
        moneyWithdraw,
        totalPayment,
        totalWithdraw,
      },
      message: `Revenue data for the year ${year} retrieved successfully.`,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
};

const getListUserPayIn = async(page, pageSize) => {
  try {
    const list = await Payment.findAndCountAll({
      attributes: ['rep', 'amount', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['username', 'avatar']
        }
      ],
      order: [['createdAt', 'desc']],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: {
        list,
        totalPages: Math.ceil(list.count/pageSize)
      },
      message: `Get list user pay in successfully.`,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
}

const getListUserPayOut = async(page, pageSize) => {
  try {
    const list = await Withdraw.findAndCountAll({
      attributes: ['rep', 'amount', 'createdAt'],
      include: [
        {
          model: Channel,
          attributes: [
            'avatar',
            [
              sequelize.literal(`(
                SELECT username
                FROM users
                WHERE users.id = Channel.userId
              )`),
              'username'
            ]
          ],
        }
      ],
      order: [['createdAt', 'desc']],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: {
        list,
        totalPages: Math.ceil(list.count/pageSize)
      },
      message: `Get list user pay out successfully.`,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
}


module.exports = {
  setStatusRequestChannel,
  getStatistic,
  getDataChartMoney,
  getTop5Channel,
  getTop5UserDeposit,
  getAllUsersRequest,
  userCount,
  unbanAccount,
  unbanChannel,
  getAllUser,
  editProfileUser,
  revenue,
  getListUserPayIn,
  getListUserPayOut,
}
