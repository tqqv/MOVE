const { Op, where } = require("sequelize");
const db = require("../models/index.js");
const { User, RequestChannel, Channel, Subscribe, Video, CategoryFollow, Category, sequelize, LevelWorkout, Livestream } = db;
const validateUsername = require("../middlewares/validateUsername.js");
const { updateStreamStats } = require("../utils/redis/stream/redisStreamService.js");



const getProfile = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id: id
      },
      attributes: ['id', 'username', 'email', 'fullName', 'isVerified', 'avatar', 'gender', 'dob', 'REPs', 'country', 'state', 'city', 'isBanned','role'],
      include: [{
        model: Channel,
        attributes: ['id','channelName', 'avatar', 'isLive', 'popularCheck', 'rep', 'isBanned']
      }]
    });
    if(!user){
      return {
        status: 400,
        message: "User not found"
      }
    }

    return {
      status: 200,
      data: user,
      message: "Get profile successfully"
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message,
      data: null
    }
  }
}
const editProfile = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if(!user){
      return {
        status: 400,
        data: null,
        message: "User not found"
      }
    }

    if(data.role) {
      return {
        status: 400,
        data: null,
        message: "You can't change your role"
      }
    }

    if(user.email && user.isVerified && data.email) {
      return {
        status: 400,
        data: null,
        message: "You can't change your verified email"
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
      status: 400,
      data: null,
      message: error.message
    }
  }
}

const viewUser = async(username) => {
  try {
    const user = await User.findOne({
      where: {
        username: username
      },
      attributes: ["username", "avatar"],
    });

    if (!user) {
      return {
        status: 404,
        data: null,
        message: "Channel not found."
      };
    }

    return {
      status: 200,
      data: {
        profile: user,
      },
      message: "Get profile user successfully"
    }
  } catch (error) {
     return {
       status: 500,
       data: null,
       message: error.message
     }
  }
}

const changePassword = async (userId, oldPass, newPass, confirmPass) => {
  try {
    const user = await User.findByPk(userId);

    if(!user) {
      return {
        status: 400,
        message: "User not found"
      }
    }

    const checkCorrectPassword = await bcrypt.compare(oldPass, user.password);

    if (!checkCorrectPassword) {
      return {
        status: 400,
        message: "Incorrect email or password",
      };
    }

    const conditions = {
      lowercase: /[a-z]/.test(newPass),
      uppercase: /[A-Z]/.test(newPass),
      number: /[0-9]/.test(newPass),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPass),
      minLength: newPass.length >= 8,
    };

    if (
      !conditions.lowercase ||
      !conditions.uppercase ||
      !conditions.number ||
      !conditions.specialChar ||
      !conditions.minLength
    ) {
      return {
        status: 400,
        message:
          "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character",
      };
    }

    if (newPass !== confirmPass) {
      return {
        status: 400,
        message: "Check your confirm password",
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPass, salt);

    user.password = hash;
    await user.save();

    return {
      status: 200,
      message: "Password updated successfully",
    };
  } catch (error) {
    return {
      status: 400,
      message: error.message
    }
  }
}

const requestChannel = async(userId) => {
  try {
    const user = await User.findByPk(userId)
    if(!user) {
      return {
        status: 400,
        message: "User not found"
      }
    }

    if(user.role !== "user") {
      return {
        status: 400,
        message: "You are not a User"
      }
    }

    const request = await RequestChannel.findOne({
      where : {
        userId: userId
      }
    })

    if (request) {
      const currentDate = new Date();
      const createdAt = new Date(request.createdAt);
      const daysDifference = Math.floor((currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDifference >= 15) {
        if (request.status === "rejected") {
          request.status = "pending";
          await request.save();

          return {
            status: 200,
            message: "Create request channel successfully."
          };
        } else {
          return {
            status: 400,
            message: "You can't send request."
          };
        }
      } else {
        return {
          status: 400,
          message: `Request must be older than 15 days. Please wait ${15 - daysDifference} days to send new request.`
        };
      }
    }


    await RequestChannel.create({userId: userId})

    return {
      status: 200,
      message: "Create request channel successfully."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const getRequestStatusById = async(userId) => {
  try {
    const result = await RequestChannel.findOne({where: {userId: userId}})
    if(!result) {
      return {
        status: 203,
        data: null,
        message: "Request not found"
      }
    }

    return {
      status: 200,
      data: result,
      message: "Get request successfully."
    }
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message
    }
  }
}

const followChannel = async (userId, channelId) => {
  try {
    const checkChannelExist = await Channel.findOne({
      where: {
        id: channelId
      }
    });

    if (!checkChannelExist) {
      return {
        status: 400,
        data: null,
        message: "Channel not found"
      };
    }

    // Lấy thông tin theo dõi hiện tại (nếu có)
    const currentSubscribe = await Subscribe.findOne({
      where: { userId, channelId }
    });

    // Kiểm tra `isNewFollow` nếu đã từng follow
    let isNewFollow = false;
    if (currentSubscribe) {
      const livestream = await Livestream.findOne({
        where: { streamerId: channelId }
      });

      if (livestream) {
        isNewFollow = currentSubscribe.createdAt > livestream.createdAt;
      }
    }

    // Nếu đã theo dõi, tiến hành hủy theo dõi
    if (currentSubscribe) {
      await Subscribe.destroy({
        where: {
          userId: userId,
          channelId: channelId
        }
      });

      if (checkChannelExist.isLive && isNewFollow) {
        await updateStreamStats(channelId, 'decrement', 'newFollowers', 1);
      }

      return {
        status: 200,
        data: null,
        message: "Unsubscribe successful."
      };
    }

    // Không được follow chính channel của mình
    const channel = await Channel.findOne({
      where: {
        userId: userId,
        id: channelId
      }
    });

    if (channel) {
      return {
        status: 400,
        data: null,
        message: "You cannot subscribe to your own channel."
      };
    }

    const subscribe = await Subscribe.create({ userId: userId, channelId: channelId });

    if (!subscribe) {
      return {
        status: 400,
        data: subscribe,
        message: "Subscription failed."
      };
    }

    await updateStreamStats(channelId, 'increment', 'newFollowers', 1);

    return {
      status: 200,
      data: null,
      message: "Subscribe successful."
    };
  } catch (error) {
    console.log(error);

    return {
      status: 400,
      data: null,
      message: error.message
    };
  }
};


const followCategory = async (userId, cateId) => {
  try {
    const checkCateExist = await Category.findOne({
      where: {
        id: cateId
      }
    })

    if(!checkCateExist) {
      return {
        status: 400,
        data: null,
        message: "Category not found"
      }
    }

    // Nếu mà có giá trị thì sẽ là unFollow
    const checkFollow = await CategoryFollow.destroy({
      where: {
        userId: userId,
        categoryId: cateId
      }})
    if(checkFollow) {
      return {
        status: 200,
        data: null,
        message: "Unfollow successful."
      }
    }

    const follow = await CategoryFollow.create({userId: userId, categoryId: cateId})

    if(!follow) {
      return {
          status: 400,
          data: null,
          message: "You follow failed."
      }
    }

    return {
      status: 200,
      data: null,
      message: "Follow category successful."
    }
  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

const listSubscribeOfUser = async(userId) => {
  try {

    const listSubscribe = await Subscribe.findAll({
      where: {
        userId: userId
      },
      include: [{
        model: Channel,
        as: "followChannel",
        where: {isBanned: false},
        attributes: ['channelName', 'avatar', 'isLive', 'popularCheck',
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM subscribes
              WHERE subscribes.channelId = followChannel.id
            )`),
            'followCount' // Alias to store the result as followCount
          ]],
        include: [{
          model: User,
          attributes: ['username']
        }]
      }]
    })
    return {
      status: 200,
      data: listSubscribe,
      message: "Get list channel you follow successfully."
    }
  } catch (error) {
    console.log(error)
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

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
        },
        status: 'public',
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
        ],
      },
      include: [{
        model: Channel,
        as: 'channel',
        attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
        include: [{
          model: User,
          attributes: ['username']
        }],
      },
      {
        model: LevelWorkout,
        as: 'levelWorkout',
        attributes: ['levelWorkout']
      },
      {
        model: Category,
        as: 'category',
        attributes: ['title']
      }],
      limit: 8,
      order: [['createdAt', 'DESC']]
    });

    const cate = await CategoryFollow.findAll({
      where: {
        userId: userId
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: [
            'id',
            'title',
            'imgUrl',
            [sequelize.literal(`(
              SELECT SUM(viewCount)
              FROM videos
              WHERE videos.categoryId = category.id
            )`), 'totalViews']
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const liveStreams = await Livestream.findAll({
      where: {
        streamerId: {
          [Op.in]: listChannelId
        },
        isLive: 1
      },
      attributes: [
        'streamerId',
        'categoryId',
        'title',
        'thumbnailUrl',
        'totalView',
        'createdAt',
        [sequelize.literal(`(
          SELECT AVG(rating)
          FROM ratings
          WHERE ratings.livestreamId = Livestream.id
        )`),
        'ratings']
      ],
      include: [
        {
          model: LevelWorkout,
          as: 'livestreamLevelWorkout',
          attributes: ['levelWorkout']
        },
        {
          model: Category,
          as: 'category',
          attributes: [
            'title',
          ]
        },
        {
          model: Channel,
          as: 'livestreamChannel',
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
          include: [{
            model: User,
            attributes: ['username']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if(!videos && !cate && !liveStreams) {
      return {
        status: 200,
        data: null,
        message: "No channels, categories have been followed."
      }
    }

    return {
      status: 200,
      data: {
        categories: cate,
        videos: videos,
        livestreams: liveStreams,
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

const isExistUsername = async(userName) => {
  try {
    let result = await User.findOne({where: {username: userName}}) || await Channel.findOne({where: {channelName: userName}});
    if(!result) {
      return {
        status: 404,
        message: "Username or channel name is not existed"
      }
    }
    return {
      status: 200,
      message: "Username or channel name is existed."
    }
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message
    }
  }
}

const getProfileByUserName = async(username) => {
  try {
    const user = await User.findOne({
      where: {
        username: username,
        isBanned: false
      },
      include: [{
        model: Channel,
        where: {isBanned: false},
        attributes: ['id','channelName', 'avatar', 'isLive', 'popularCheck','facebookUrl','youtubeUrl','instaUrl','bio',
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM subscribes
              WHERE subscribes.channelId = Channel.id
            )`),
            'followCount'
          ]
        ],required: false
      }],
      attributes: ['username', 'avatar', 'id']
    })

    if(!user) {
      return{
        status: 404,
        data: null,
        message: "User not found"
      }
    }
    return {
      status: 200,
      data: user,
      message: "Get profile successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const checkUserFollowCate = async(userId, cateId) => {
  try {
    const follow = await CategoryFollow.findOne({where: {
      userId: userId,
      categoryId: cateId
    }})

    if(follow) {
      return {
        status: 200,
        data: {follow: true},
        message: "Followed."
      }
    }else {
      return {
        status: 200,
        data: {follow: false},
        message: "Not yet."
      }
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

module.exports = {
  getProfile,
  editProfile,
  changePassword,
  getRequestStatusById,
  requestChannel,
  listSubscribeOfUser,
  followChannel,
  getAllInforFollow,
  isExistUsername,
  getProfileByUserName,
  followCategory,
  checkUserFollowCate,
}
