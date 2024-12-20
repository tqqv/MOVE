const { Op, fn, col } = require("sequelize");
const db = require("../models/index.js");
const livestream = require("../models/livestream.js");
const { set, get } = require("../utils/redis/base/redisBaseService.js");
const { getNumOfConnectInRoom } = require("./socketService.js");
const StreamKeys = require("../utils/redis/key/streamKey.js");
const _redis = require("../utils/redis/config.js");
const { getTopDonatorsWithDetails, clearStreamStats } = require("../utils/redis/stream/redisStreamService.js");
const { fetchGeoData } = require("./videoService.js");
const { createNotification } = require("./notificationService.js");
const { Livestream, Donation, Rating, sequelize, Channel, User, Category, LevelWorkout, Subscribe, Sequelize, ViewVideo } = db;

const createLivestream = async(data) => {
  try {
    if(!data){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }
    const currentUtcTime = new Date().toISOString();

    data.createdAt = currentUtcTime;

    if(data.streamKey.includes('streamKey=')){
      data.streamKey = data.streamKey.split('streamKey=')[1];
    }

    const newLiveStream = await Livestream.create(data);
    const channel = await Channel.findOne({
      where: {
        id: newLiveStream.streamerId
      }
    })
    channel.isLive = true;
    channel.save();
    newLiveStream.isLive = true;
    newLiveStream.save();

    _io.to(channel.id).emit('socketLiveStatus', 'streamPublished');
    await set(`channel_${channel.id}_live_status`, 'streamPublished');
    await createNotification(
      "followedChannel",
      "newStream",
      null,
      newLiveStream.streamerId,
      newLiveStream.streamerId,
      null,
      null,
      null,
      null
    )
    return {
      status: 200,
      data: newLiveStream,
      message: 'Created livestream successfully'
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getTopLivestreamService = async (page, pageSize, level, category, sortCondition) => {
  try {
    const livestreams = await Livestream.findAll({
      where: { isLive: true },
      attributes: {
        exclude: ['streamKey'],
        include: [
          [
            Sequelize.literal(`(
            SELECT AVG(rating) as ratings
                FROM ratings
                WHERE ratings.livestreamId = Livestream.id
            )`),
            'ratings'
          ]
        ]
       },
      include: [
        {
          model: Category,
          attributes: ["title"],
          where: category ? {title: category} : {},
          as: 'category'
        },
        {
          model: LevelWorkout,
          attributes: ["levelWorkout"],
          where: level ? {levelWorkout: level} : {},
          as: 'livestreamLevelWorkout'
        },
        {
          model: Channel,
          attributes: ["channelName", "avatar", "popularCheck", "bio"],
          as: "livestreamChannel"
        }
      ],
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });

    const livestreamsWithStats = await Promise.all(livestreams.map(async (livestream) => {
      const currentViews = await get(`channelStreamId:${livestream.streamerId}:currentViews`);
      const avgRates = await get(`channelStreamId:${livestream.streamerId}:avgRates`);
      return {
        ...livestream.toJSON(),
        currentViews,
        avgRates
      };
    }));

    return {
      status: 200,
      data:  livestreamsWithStats,
      message: 'Retrieve data success'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const getLivestreamService = async (username) => {
  try {
    const user = await User.findOne({
      where: { username: username }
    });
    const channel = await Channel.findOne({
      where: { userId: user.id}
    });

    const livestream = await Livestream.findOne({
      where: { streamerId: channel.id },
      order: [['createdAt', 'DESC']],
      include: [
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
    });

    const totalRepsData = await Livestream.findOne({
      where: { id: livestream.id },
      attributes: [
        'totalShare',
        [Sequelize.fn('SUM', Sequelize.col('streamDonator.REPs')), 'totalReps']
      ],
      include: [
        {
          model: Donation,
          as: 'streamDonator',
          attributes: []
        }
      ],
      group: ['Livestream.id']
    });

    const averageRatingData = await Livestream.findOne({
      where: { id: livestream.id },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('streamRator.rating')), 'averageRating']
      ],
      include: [
        {
          model: Rating,
          as: 'streamRator',
          attributes: []
        }
      ],
      group: ['Livestream.id']
    });


    // Lấy topDonators
    const donations = await Donation.findAll({
      where: { livestreamId: livestream.id }, // Lọc theo livestream cụ thể
      attributes: [
        'userId',
        [Sequelize.fn('SUM', Sequelize.col('Donation.REPs')), 'totalReps'], // Tổng số REPs
      ],
      group: ['Donation.userId', 'User.id', 'Channel.id'], // Nhóm theo userId, User.id và Channel.id
      order: [[Sequelize.literal('totalReps'), 'DESC']], // Sắp xếp giảm dần theo REPs
      limit: 7, // Lấy top 7
      include: [
        {
          model: User, // Thông tin user
          attributes: ['id', 'username', 'avatar'], // Lấy các cột từ User
        },
        {
          model: Channel, // Thông tin channel
          attributes: ['id', 'channelName', 'avatar'], // Các cột từ Channel
          required: false, // Đảm bảo truy vấn vẫn chạy nếu không có Channel (nếu không có channel)
        },
      ],
    });

    console.log(donations);


    // Định dạng dữ liệu theo yêu cầu
    // Định dạng dữ liệu theo yêu cầu
    const topDonators = donations.map((donation) => {
      const channel = donation.dataValues.Channel; // Lấy Channel từ donation
      const user = donation.dataValues.User; // Lấy User từ donation
      const donator = channel || user; // Nếu có Channel thì lấy, nếu không lấy User

      return {
        donatorId: donator.id, // Lấy ID từ Channel nếu có, nếu không lấy ID từ User
        donatorName: donator.channelName || donator.username, // Lấy tên từ Channel nếu có, nếu không lấy từ User
        donatorAvatar: donator.avatar, // Lấy avatar từ Channel hoặc User
        username: user.username, // Luôn trả về username
        totalReps: parseInt(donation.dataValues.totalReps), // Tổng REPs
        isChannel: !!channel, // Kiểm tra nếu là channel
      };
    });
    // await clearStreamStats(channel.id);
    return {
      status: 200,
      data: {
        channel,
        livestream: {
          ...livestream.toJSON(),
          totalReps: totalRepsData.get('totalReps') || 0,
          avgRates: averageRatingData.get('averageRating') || 0,
          topDonators,
        }
      },
      message: 'Retrieve data success'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const getAllLivestreamService = async (page, pageSize, level, category, sortCondition) => {
  try {
    const listLivestream = await Livestream.findAndCountAll({
      attributes: [
        "title",
        "description",
        "thumbnailUrl",
        "isLive",
        "totalView",
        [Sequelize.literal('(SELECT AVG(rating) FROM ratings WHERE ratings.livestreamId = Livestream.id)'), 'avgRates'], // Tính trung bình avgRates
      ],
      where: { isLive: true },
      include: [
        {
          model: Channel,
          attributes: ["channelName", "avatar", "isLive", "popularCheck"],
          as: "livestreamChannel",
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
        {
          model: LevelWorkout,
          attributes: ["levelWorkout"],
          as: "livestreamLevelWorkout",
          where: level ? { levelWorkout: level } : {},
        },
        {
          model: Category,
          attributes: ["title"],
          as: "category",
          where: category ? { title: category } : {},
        },
        {
          model: Rating,
          attributes: [],
          as: "streamRator",
        },
      ],
      group: ["Livestream.id"], // Nhóm theo Livestream ID để tính trung bình
      order: [
        sortCondition.sortBy === "avgRates"
          ? [Sequelize.literal("avgRates"), sortCondition.order] // Sắp xếp theo avgRates
          : [sortCondition.sortBy, sortCondition.order], // Sắp xếp theo các trường khác
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    // Calculate total pages
    const totalLivestreams = listLivestream.count.reduce((sum, item) => sum + item.count, 0); // Sum all counts
    const totalPages = Math.ceil(totalLivestreams / pageSize); // Calculate total pages

    // Fetch livestreams with stats
    const livestreamsWithStats = await Promise.all(listLivestream.rows.map(async (livestream) => {
      const currentViews = await get(`channelStreamId:${livestream.streamerId}:currentViews`);
      return {
        ...livestream.toJSON(),
        currentViews: currentViews || 0,
      };
    }));

    return {
      status: 200,
      data: {
        livestreamsWithStats,
        totalPages, // Correctly calculated totalPages
      },
      message: 'Retrieve data success'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const getLivestreamByUserNameService = async (username) => {
  try {
    const user = await User.findOne({
      where: { username: username }
    });
    const channel = await Channel.findOne({
      where: { userId: user.id},
      attributes: {
        include: [
          [
            // Count the number of subscribes for this channel
            Sequelize.literal(`
              (SELECT COUNT(*) FROM subscribes WHERE subscribes.channelId = Channel.id)`
            ),
            "followCount"
          ]
        ],
      },
      include: [
        {
          model: Subscribe,
          as: 'subscribe',
          attributes: [], // Exclude individual Subscribe attributes
        },
        {
          model: User,
          attributes: ['username'],
        },
      ]
    });

    if(channel.isLive) {
      const livestream = await Livestream.findOne(
        {where:
          {
            streamerId: channel.id,
            isLive: true
          },
          include: [
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
        },
      )
      return {
        status: 200,
        data: {channel, livestream},
        message: 'Retrieve data success'
      };
    }
    return {
      status: 200,
      data: {channel},
      message: 'Retrieve data success'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const getLivestreamStatistics = async (streamId) => {
  try {
    // get total REPs
    const totalRepsData = await Livestream.findOne({
      where: { id: streamId },
      attributes: [
        'totalShare',
        [Sequelize.fn('SUM', Sequelize.col('streamDonator.REPs')), 'totalReps']
      ],
      include: [
        {
          model: Donation,
          as: 'streamDonator',
          attributes: []
        }
      ],
      group: ['Livestream.id']
    });

    // get avg Rating
    const averageRatingData = await Livestream.findOne({
      where: { id: streamId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('streamRator.rating')), 'averageRating']
      ],
      include: [
        {
          model: Rating,
          as: 'streamRator',
          attributes: []
        }
      ],
      group: ['Livestream.id']
    });
    // get view count
    return {
      status: 200,
      data: {
        viewCount : getNumOfConnectInRoom((await Livestream.findOne({where: {id: streamId}})).streamerId),
        totalShare: totalRepsData.totalShare,
        totalReps: totalRepsData.get('totalReps') || 0,
        averageRating: averageRatingData.get('averageRating') || 0
      },
      message: 'Retrieve data success'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const updateLivestream = async(data) => {
  try {
    const livestream = await Livestream.findByPk(data.livestreamId)
    if(!livestream) {
      return {
        status: 400,
        data: null,
        message: "Livestream not found"
      }
    }
    const updateLivestream = await livestream.update(data)
    if(!updateLivestream) {
      return {
        status: 400,
        data: null,
        message: "Edit failed." // update fail
      }
    }

    return {
      status: 200,
      data: updateLivestream,
      message: "Livestream edit successfully."
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}


const getAllLivestreamSessionService = async (streamerId, page, pageSize, sortCondition) => {
  try {
    const listLivestream = await Livestream.findAndCountAll({
      attributes: ["id", "createdAt", "duration"],
      where: { streamerId, isLive: false,duration: { [Sequelize.Op.ne]: null } },
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });

    // Map through the livestream list to add the 'timeLive' field
    const enhancedList = listLivestream.rows
    .map(livestream => {
      const createdAt = new Date(livestream.createdAt);
      const duration = parseInt(livestream.duration, 10);
      const endDateTime = new Date(createdAt.getTime() + duration * 60000);

      // Manually format start date as "11 Nov 2024"
      const day = String(createdAt.getDate()).padStart(2, '0');
      const month = createdAt.toLocaleString('en-US', { month: 'short' });
      const year = createdAt.getFullYear();
      const formattedStartDate = `${day} ${month} ${year}`;

      // Format times as "02:05 PM" and "03:30 PM"
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      const startTime = timeFormatter.format(createdAt);
      const endTime = timeFormatter.format(endDateTime);

      // Check if the end date is different from the start date
      const endDay = String(endDateTime.getDate()).padStart(2, '0');
      const endMonth = endDateTime.toLocaleString('en-US', { month: 'short' });
      const endYear = endDateTime.getFullYear();
      const formattedEndDate = `${endDay} ${endMonth} ${endYear}`;

      // Construct "timeLive" based on whether the dates are the same or different
      const timeLive = (formattedStartDate === formattedEndDate)
        ? `${formattedStartDate} - ${startTime} to ${endTime}`
        : `${formattedStartDate} - ${startTime} to ${formattedEndDate} - ${endTime}`;

      return {
        ...livestream.toJSON(),
        timeLive,
      };
    });

    return {
      status: 200,
      data: {
        listLivestream: { ...listLivestream, rows: enhancedList },
        totalPages: Math.ceil(listLivestream.count / pageSize)
      },
      message: 'Retrieve data success'
    };
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const getAgeData = async (livestreamId) => {
  const whereCondition = {
    livestreamId,
  };

  return await ViewVideo.findAll({
    where: whereCondition,
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: []
    }],
    attributes: [
     [Sequelize.literal(`
        CASE
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) < 18 THEN 'Under 18'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 18 AND 24 THEN '18-24'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 25 AND 34 THEN '25-34'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 35 AND 44 THEN '35-44'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 45 AND 54 THEN '45-54'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) >64 THEN '64 above'
          ELSE 'Unknown'
        END
      `), 'ageGroup'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['ageGroup'],
    raw: true
  });
};

const getGenderData = async (livestreamId) => {
  const whereCondition = {
    livestreamId,
  };

  return await ViewVideo.findAll({
    where: whereCondition,
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: [] // Không cần lấy thêm thuộc tính từ User
    }],
    attributes: [
      [Sequelize.literal(`
        CASE
          WHEN viewVideoUser.gender = 'Male' THEN 'Male'
          WHEN viewVideoUser.gender = 'Female' THEN 'Female'
          ELSE 'Other'
        END
      `), 'genderGroup'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['genderGroup'] // Nhóm theo genderGroup để có thể đếm viewer
  });
};

const getDataCountryByIp = async (livestreamId) => {
  const whereCondition = {
    livestreamId,
  };

  const countryData = await ViewVideo.findAll({
    where: whereCondition,
    attributes: [
      'country',
      [Sequelize.fn('COUNT', Sequelize.col('country')), 'viewerCount']
    ],
    group: ['country'],
    raw: true
  });

  return countryData;
};

const getStateByCountryAndStreamIdFromIp = async(livestreamId, country) => {
  try {
    const whereCondition = {
      livestreamId,
      country
    };

    const stateData = await ViewVideo.findAll({
      where: whereCondition,

      attributes: [
        'city',
        [Sequelize.fn('COUNT', Sequelize.col('viewerId')), 'viewerCount']
      ],
      group: ['city'],
      raw: true
    });

    return {
      status: 200,
      data: stateData,
      message: `Get list city of ${country} successfully.`
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: error
    };
  }
}

const getLivestreamSessionDetailsService = async (livestreamId) => {
  try {
    const livestream = await Livestream.findOne({
      where: { id: livestreamId },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT AVG(rating) as ratings
                FROM ratings
                WHERE ratings.livestreamId = Livestream.id
            )`),
            'ratings'
          ],
          [
            Sequelize.literal(`(
            SELECT SUM(REPs) as REPs
                FROM donations
                WHERE donations.livestreamId = Livestream.id
            )`),
            'repsEarned'
          ],
          [
            Sequelize.literal(`(
              SELECT AVG(viewTime) as avgView
                  FROM viewVideos
                  WHERE viewVideos.livestreamId = Livestream.id
              )`),
              'avgView'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*) as totalViewer
                FROM viewVideos
                WHERE viewVideos.livestreamId = Livestream.id
            )`),
            'totalViewer'
          ]
        ],
      }
    })


    let newFollowers = await countNewFollowersDuringStream(livestream.streamerId, livestream.createdAt, livestream.duration) || 0;

    const [ageData, genderData, dataByIp] = await Promise.all([
      getAgeData(livestreamId),
      getGenderData(livestreamId),
      getDataCountryByIp(livestreamId)
    ]);

    return {
      status: 200,
      data: {
        livestream,
        newFollowers,
        data: {
          ageData,
          genderData,
          dataByIp
        }
      },
      message: 'Retrieve data success'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
}

const countNewFollowersDuringStream = async (channelId, createdAt, duration) => {
  try {
    const durationInMinutes = parseInt(duration, 10);
    const streamStartTime = new Date(createdAt);
    const streamEndTime = new Date(streamStartTime.getTime() + durationInMinutes * 60000);

    const followerCount = await Subscribe.count({
      where: {
        channelId,
        createdAt: {
          [Op.between]: [streamStartTime, streamEndTime] // Filter by the stream's time range
        }
      }
    });

    return followerCount;
  } catch (error) {
    console.error(`Error counting followers for channel ${channelId}:`, error);
    throw error;
  }
};

const saveDataViewer = async(userId, livestreamId, ip, viewTime) => {
  try {
    const livestream = await Livestream.findOne({where: {id: livestreamId}})
    if(!livestream) {
      return {
        status: 404,
        message: "Livestream not found."
      }
    }

    const user = await User.findOne({where: {id: userId}})
    const checkView = await ViewVideo.findOne({where: {viewerId: userId, livestreamId: livestreamId}})
    if(user && checkView){
      checkView.viewTime += viewTime;
      await checkView.save()
      return {
        status: 200,
        message: "Update successful."
      }
    }

    if(user && !checkView){
      const url = `https://api.ipregistry.co/${ip}?key=${process.env.FIND_IP_API_KEY}`;
      const res = await fetchGeoData(url)

      const viewData = await ViewVideo.create({viewerId: userId, livestreamId: livestreamId, ip: ip, country: res.country, city: res.city, viewTime: viewTime})

      if(viewData) {
        return {
          status: 200,
          message: "Add viewer data successfully."
        }
      }
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}


module.exports = {
  getLivestreamService,
  getLivestreamByUserNameService,
  createLivestream,
  getLivestreamStatistics,
  updateLivestream,
  getTopLivestreamService,
  getAllLivestreamService,
  getAllLivestreamSessionService,
  getLivestreamSessionDetailsService,
  getStateByCountryAndStreamIdFromIp,
  saveDataViewer,
}
