const { Op } = require("sequelize");
const db = require("../models/index.js");
const { listSubscribeOfUser } = require("./userService.js");
const { Channel, Subscribe, User, Video, Category, CategoryFollow, LevelWorkout, sequelize } = db;


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

    return {
      status: 200,
      data: channel,
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
        [Op.or]: [
          { title: { [Op.like]: `%${normalData}%` } }
        ]
      },
      limit: limitInt,
      offset: offsetInt,
    })

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
        [sequelize.literal("Channel.id IS NOT NULL"), "DESC"],  // co channel xep truoc
        ["username", "ASC"],
      ],
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

module.exports = {
  createChannel,
  listSubscribeOfChannel,
  getProfileChannel,
  editProfileChannel,
  viewChannel,
  searchVideoChannel,
}
