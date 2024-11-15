const { Op } = require("sequelize");
const db = require("../models/index.js");
const { listSubscribeOfUser } = require("./userService.js");
const { Channel, Subscribe, User, Video, Category, CategoryFollow, LevelWorkout, Livestream, sequelize, ViewVideo, Comment, Donation } = db;
const { v4: uuidv4 } = require('uuid');
const { remove, get, set } = require("../utils/redis/base/redisBaseService.js");
const {  takeFinalSnapshot } = require("../utils/redis/stream/redisStreamService.js");

// Function này để lúc admin accept request live sẽ gọi
const createChannel = async (userId, username, avatar) => {
  try {
    const channel = await Channel.create({ userId: userId, channelName: username, avatar: avatar })

    if(!channel) {
        return {
            status: 400,
            data: channel,
            message: "Create channel failed."
        }
    }
    return {
        status: 200,
        data: channel,
        message: "Create channel successfully."
    }
  } catch (error) {
    return {
        status: 400,
        data: null,
        message: error.message
    }
  }
}


const listSubscribeOfChannel = async (channelId) => {
  try {
    const channel = await Channel.findByPk(channelId)

    if(!channel){
      return {
        status: 400,
        data: null,
        message: "Channel not found"
      }
    }

    const listFollow = await listSubscribeOfUser(channel.userId)

    if(listFollow.status === 200){
      return {
        status: listFollow.status,
        data: listFollow.data,
        message: "Get list subscriber of channel successfully."
      }
    }else {
      return {
        status: listFollow.status,
        data: listFollow.data,
        message: listFollow.message
      }
    }
  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

const getProfileChannel = async(userId) =>{
  try {
    const channel = await Channel.findOne({
      include: [{
        model: User,
        attributes: ["username"],
        where: {
          id: userId
        }
      }]
    });

    if (!channel) {
      return {
        status: 404,
        data: null,
        message: "Channel not found."
      };
    }
    const liveStatus = await get(`channel_${channel.id}_live_status`);

    return {
      status: 200,
      data: {...channel.toJSON(), liveStatus},
      message: "Get profile channel successfully."
    }

  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

const editProfileChannel = async(userId, data, username) => {
  try {

    if(username === "" || data.channelName === ""){
      return {
        status: 400,
        data: null,
        message: "Username or channel name cannot be empty."
      }
    }

    if(username) {
      const user = await User.findByPk(userId)

      if (username.length < 3 || username.length > 32) {
        return {
          status: 400,
          data: null,
          message: "Must be between 3 and 32 in length."
        }
      } else if (!validateUsername(username)) {
        return {
          status: 400,
          data: null,
          message: "Please only use numbers, letters, underscores or periods."
        }
      }

      const usernameCheck = await User.findOne({where: {username: username}})
      if(usernameCheck) {
        return {
          status: 400,
          data: null,
          message: "Username already exists."
        }
      }

      await user.update({
        username: username
      })
    }

    const channel = await Channel.findOne({
      where: {
        userId: userId
      },
      include: [{
        model: User,
        attributes: ['username']
      }]
    })

    if(!channel) {
      return {
        status: 404,
        data: null,
        message: "Channel not found."
      }
    }

    const updateChannel = await channel.update(data);

    return {
      status: 200,
      data: updateChannel,
      message: "Update profile channel successfully."
    }
  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

const viewChannel = async(username) => {
  try {
    const channel = await Channel.findOne({
      include: [{
        model: User,
        attributes: ["username"],
        where: {
          username: username
        }
      }]
    });

    if (!channel) {
      return {
        status: 404,
        data: null,
        message: "Channel not found."
      };
    }


    // const profile = await getInfoChannel(channel.id)
    // if (!profile) {
    //   return {
    //     status: 404,
    //     data: null,
    //     message: "Channel not found"
    //   }
    // }

    // API list video code here

    const followerCount = await Subscribe.count({
      where: {
        channelId: channel.id
      }
    });

    return {
      status: 200,
      data: {
        profile: channel,
        totalFollower: followerCount,
      },
      message: "Get profile channel successfully"
    }
  } catch (error) {
     return {
       status: 500,
       data: null,
       message: error.message
     }
  }
}

const searchVideoChannel = async(data, limit, offset) => {
  try {
    if(!data) {
      return {
        status: 400,
        data: null,
        message: "Data cannot be empty"
      }
    }

    const normalData = data.trim().toLowerCase();
    // if(!limit)
    const limitInt = parseInt(limit)
    const offsetInt = parseInt(offset)

    const cates = await Category.findAll({
      where: {
        title: { [Op.like]: `%${normalData}%` }
      },
      attributes: [
        'id',
        'imgUrl',
        'title',
        [
          sequelize.literal(`(
            SELECT SUM(viewCount)
            FROM videos AS categoryVideos
            WHERE categoryVideos.categoryId = Category.id
          )`),
          'totalViews'
        ]
      ],
      group: ['Category.id'],
      limit: limitInt,
      offset: offsetInt
    });

    const videos = await Video.findAll({
      where: {
        title: { [Op.like]: `%${normalData}%` }
      },
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['title']
        },
        {
          model: LevelWorkout,
          as: 'levelWorkout',
          attributes: ['levelWorkout']
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM ratings
              WHERE ratings.videoId = Video.id
            )`),
            'averageRating'
          ]
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: limitInt,
      offset: offsetInt
    });



    const user = await User.findAll({
      include: [
        {
          model: Channel,
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck',
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM subscribes
                WHERE subscribes.channelId = Channel.id
              )`),
              'followCount' // Alias to store the result as followCount
            ]]
        }
      ],
      attributes: ['username', 'avatar'],
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${normalData}%` } }, // Truy vấn LIKE trên username
          { '$Channel.channelName$': { [Op.like]: `%${normalData}%` } } // Truy vấn LIKE trên channelName của bảng Channel
        ]
      },
      order: [
        [sequelize.literal("Channel.id IS NOT NULL"), "DESC"],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM subscribes
            WHERE subscribes.channelId = Channel.id
          )`),
          'DESC'
        ],  // co channel xep truoc
        ["username", "ASC"],
      ],
      limit: limitInt,
      offset: offsetInt,
    });

    return {
      status: 200,
      data: {
        categories: cates,
        videos: videos,
        users: user
      },
      message: "Successfully"
    };

  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
};

const getAllInforFollow = async(userId) => {
  try {
    const listSubscribe = await Subscribe.findAll({
      where: {
        userId: userId
      },
      attributes: ['channelId'],
    })

    const listChannelId = listSubscribe.map(follow => follow.channelId);

    const videos = await Video.findAll({
      where: {
        channelId: {
          [Op.in]: listChannelId
        }
      },
      include: [{
        model: Channel,
        as: 'channel',
        attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
      }],
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    const cate = await CategoryFollow.findAll({
      where: {
        userId: userId
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['title', 'imgUrl'],
      }],
      limit: 4,
      order: [['createdAt', 'DESC']]
    })

    if(!videos && !cate) {
      return {
        status: 200,
        data: null,
        message: "No channels, categories have been followed."
      }
    }

    // thieu live stream ...

    return {
      status: 200,
      data: {
        categories: cate,
        videos: videos
      },
      message: "Get all infor successfully"
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const generatedStreamKey = async() => {
  let streamKey = '';
  let isUnique = false;

  // Keep generating a new streamKey until a unique one is found
  while (!isUnique) {
    streamKey = "MOVE" + uuidv4().slice(0, 20);
    const existingUser = await Channel.findOne({ where: { streamKey } });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return streamKey;
}


const createStreamKey = async(channelId) => {
  try {
    const channel = await Channel.findByPk(channelId);
    if(channel) {
      channel.streamKey = await generatedStreamKey();
    }

    await channel.save();
    return {
      status: 200,
      data: channel.streamKey,
      message: "Create stream key successfully."
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const validateStreamKey = async (streamKey) => {
  try {
    const channel = await Channel.findOne({where: {streamKey: streamKey}});
    if(!channel){
      return {
        status: 404,
        data: streamKey,
        message: "Streaming Key is invalid or does not belong to the specified user."
      };
    }
    setTimeout(
      () => _io.to(channel.id).emit('socketLiveStatus', 'streamReady'), 10000
    )
    // lỡ họ auto bật stream mà kh publish thì phải có cơ chế expire ( sau 5' )
    await set(`channel_${channel.id}_live_status`, 'streamReady');
    return {
      status: 200,
      data: streamKey,
      message: "Streaming Key is valid"
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: streamKey,
      message: error.message
    }
  }
}

const endStream = async(data) => {
  try {
    const channel = await Channel.findOne({where: {streamKey: data.streamKey}});
    if(!channel){
      return {
        status: 404,
        message: "End stream fail"
      }
    }
    // nếu đã tắt từ OBS thì return
    if(!channel.isLive) {
      // bắt case status = streamReady ( chưa publish nên isLive vẫn false )
      _io.to(channel.id).emit('socketLiveStatus', 'null');
      await remove(`channel_${channel.id}_live_status`);
      return {
        status: 200,
        message: "Stream have already end"
      }
    }

    // REDIS HANDLING
    let liveStatus = await get(`channel_${channel.id}_live_status`);
    if (liveStatus == 'streamPublished') {
      // FINAL SNAPSHOT
      await takeFinalSnapshot(channel.id);
      _io.to(channel.id).emit('socketLiveStatus', 'streamEnded');
      await set(`channel_${channel.id}_live_status`, 'streamEnded', 20);
    } else if (liveStatus == 'streamReady') {
      _io.to(channel.id).emit('socketLiveStatus', 'null');
      await remove(`channel_${channel.id}_live_status`);
    }
    // SERVER DATABASE HANDLING
    const livestream = await Livestream.findOne({where: { isLive: true, streamerId: channel.id }});
    livestream.isLive = false;
    livestream.save();
    channel.isLive = false;
    channel.save();
    return {
      status: 200,
      data: {channel, livestream},
      message: "Stream ended suceess"
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const overviewAnalytic = async(channelId) => {
  try {
    let avgViewVideo;
    let viewVideo;
    let avgViewStream;
    let viewStream;
    let totalRepEarn = 0;
    const videos = await Video.findAll({
      where: {
        channelId: channelId
      },
      attributes: [
        'id',
        'channelId',
      ],
    })

    if(videos.length > 0) {
      const listVideoId = videos.map(video => video.id);

      const totalVideoView = await Video.findOne({
        where: {
          channelId: channelId
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('viewCount')), 'totalVideoView']
        ],
        raw: true
      });

      viewVideo = totalVideoView.totalVideoView

      const avgViewTime = await ViewVideo.findOne({
        where: {
          videoId: {
            [Op.in]: listVideoId
          }
        },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('viewTime')), 'avgViewTime']
        ],
        raw: true
      });

      const repEarnFromVideo = await Comment.findOne({
        where: {
          videoId: {
            [Op.in]: listVideoId
          }
        },
        attributes: [
          [sequelize.fn('Sum', sequelize.col('rep')), 'repEarn']
        ],
        raw: true
      })

      totalRepEarn += parseInt(repEarnFromVideo.repEarn)
      avgViewVideo = avgViewTime.avgViewTime
    }

    const livestreams = await Livestream.findAll({
      where: {
        streamerId: channelId
      },
      attributes: [
        'id',
        'streamerId',
      ],
    })

    if(livestreams.length > 0) {
      const listlivestreamId = livestreams.map(livestream => livestream.id);

      const totalStreamView = await Livestream.findOne({
        where: {
          streamerId: channelId
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('totalView')), 'totalStreamView']
        ],
        raw: true
      });

      viewStream = totalStreamView.totalStreamView

      const avgViewTime = await ViewVideo.findOne({
        where: {
          livestreamId: {
            [Op.in]: listlivestreamId
          }
        },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('viewTime')), 'avgViewTime']
        ],
        raw: true
      });

      const repEarnFromStream = await Donation.findOne({
        where: {
          livestreamId: {
            [Op.in]: listlivestreamId
          }
        },
        attributes: [
          [sequelize.fn('Sum', sequelize.col('REPs')), 'repEarn']
        ],
        raw: true
      })

      totalRepEarn += parseInt(repEarnFromStream.repEarn)
      avgViewStream = avgViewTime.avgViewTime
    }

    const latestVideos = await Video.findAll({
      where: {
        channelId: channelId,
        status: 'public'
      },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM ratings
              WHERE ratings.videoId = Video.id
            )`),
            'ratings'
          ],
          [
            sequelize.literal(`(
              SELECT SUM(rep)
              FROM comments
              WHERE comments.videoId = Video.id
            )`),
            'totalReps'
          ],
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 1
    });

    const latestStream = await Livestream.findAll({
      where: {
        streamerId: channelId
      },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM ratings
              WHERE ratings.livestreamId = Livestream.id
            )`),
            'ratings'
          ],
          [
            sequelize.literal(`(
              SELECT SUM(REPs)
              FROM donations
              WHERE donations.livestreamId = Livestream.id
            )`),
            'totalReps'
          ],
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 1
    })

    const followerCount = await Subscribe.count({
      where: {
        channelId: channelId
      }
    });


    return {
      status: 200,
      data: {
        overview: {
          followerCount,
          totalRepEarn
        },
        latestVideos,
        latestStream,
        videoSummary: {
          totalVideoView: viewVideo,
          avgView: avgViewVideo
        },
        streamSummary: {
          totalStreamView: viewStream,
          avgView: avgViewStream
        }
      },
      message: "Stream ended suceess"
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

module.exports = {
  createChannel,
  listSubscribeOfChannel,
  getProfileChannel,
  editProfileChannel,
  viewChannel,
  searchVideoChannel,
  getAllInforFollow,
  createStreamKey,
  validateStreamKey,
  endStream,
  generatedStreamKey,
  overviewAnalytic,
}
