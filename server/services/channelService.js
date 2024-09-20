const { Op } = require("sequelize");
const db = require("../models/index.js");
const { Channel, Subscribe, User, Video, Category } = db;


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

const subscribeChannel = async (userId, channelId) => {
  try {
    console.log(channelId);
    const checkSubscribe = await Subscribe.destroy({
      where: {
        userId: userId,
        channelId: channelId
      }})
      if(checkSubscribe) {
        return {
          status: 200,
          data: null,
          message: "Unsubscribe successful."
        }
      }


    const channel = await Channel.findOne({
      where: {
        userId: userId,
        id: channelId
      }
    })

    if(channel){
      return {
        status: 400,
        data: null,
        message: "You can not subscribe your channel."
      }
    }

    const subscribe = await Subscribe.create({userId: userId, channelId: channelId})

    if(!subscribe) {
      return {
          status: 400,
          data: subscribe,
          message: "You subscribe failed."
      }
    }
    return {
      status: 200,
      data: null,
      message: "Subscribe successful."
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

    console.log(listFollow);


    // const subscriber = await Subscribe.findAll({
    //   where: {
    //     channelId: channelId,
    //   },
    //   include: [
    //     {
    //       model: User,
    //       as: 'subscribeUser',
    //       attributes: ['username', 'avatar', 'role'],
    //       include: [
    //         {
    //           model: Channel,
    //           attributes: ['channelName', 'avatar'],
    //         }
    //       ]
    //     },
    //   ],
    // });

    return {
      status: listFollow.status,
      data: listFollow.data,
      message: "Get list subscriber of channel successfully."
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
    // console.log(userId);

    const listSubscribe = await Subscribe.findAll({
      where: {
        userId: userId
      },
      include: [{
        model: Channel,
        as: "subscribeChannel",
        attributes: ['channelName', 'avatar']
      }]
    })
    return {
      status: 200,
      data: listSubscribe,
      message: "Get list channel you follow successfully."
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

      if(!user) {
        return {
          status: 404,
          data: null,
          message: "User not found."
        }
      }

      const checkExist = await User.findOne({where: {
        username: username
      }})

      if(checkExist) {
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
        [Op.or]: [
          { title: { [Op.like]: `%${normalData}%` } }
        ]
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username'],
        include: [{ model: Channel, attributes: ['channelName'] }]
      }],
      limit: limitInt,
      offset: offsetInt,
      order: [['createdAt', 'DESC']]
    });

    const user = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${normalData}%` } },
        ]
      },
      attributes: ['username', 'avatar'],
      include: [{ model: Channel, attributes: ['channelName', 'avatar'], where: { channelName: { [Op.like]: `%${normalData}%` }}}],
      limit: limitInt,
      offset: offsetInt,
      order: [['createdAt', 'DESC']]
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
  subscribeChannel,
  listSubscribeOfChannel,
  listSubscribeOfUser,
  getProfileChannel,
  editProfileChannel,
  viewChannel,
  searchVideoChannel
}
