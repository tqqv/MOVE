const db = require("../models/index.js");
const { Channel, Subscribe } = db;


// Function này để lúc admin accept request live sẽ gọi
const createChannel = async (userId) => {
  try {
    const channel = await Channel.create({ userId: userId })

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

const followChannel = async (userId, channelId) => {
  try {
    const channel = await Channel.finOne({
      where: {
        userId: userId,
        id: channelId
      }
    })
    if(channel){
      return {
        status: 400,
        data: null,
        message: "You can not follow your channel."
      }
    }
    const subscribe = await Subscribe.create({userId: userId, channelId: channelId})
    if(!subscribe) {
      return {
          status: 400,
          data: subscribe,
          message: "You follow failed."
      }
    }
    return {
      status: 200,
      data: null,
      message: "Follow successful."
    }
  } catch (error) {
    return {
      status: 200,
      data: null,
      message: error.message
    }
  }
}

const unFollowChannel = async (userId, channelId) => {
  try {
    const subscribe = await Subscribe.destroy({
      where: {
        userId: userId,
        channelId: channelId
      }})
    if(!subscribe) {
      return {
          status: 400,
          data: subscribe,
          message: "You unfollow failed."
      }
    }
    return {
      status: 200,
      data: null,
      message: "Unfollow successful."
    }
  } catch (error) {
    return {
      status: 200,
      data: null,
      message: error.message
    }
  }
}

const listFollowed = async (channelId) => {
  try {
    const followed = await Subscribe.findAll({
      where: {
        channelId: channelId,
      },
      include: [
        {
          model: User,
          as: 'subscriber', // alias này phải đúng theo thiết kế quan hệ Sequelize
          attributes: ['username', 'avatar'], // Lấy thông tin subscriber
          required: true,
          include: [
            {
              model: Channel,
              as: 'channel', // alias này phải đúng theo thiết kế quan hệ Sequelize
              attributes: ['avatar', 'channelName'],
              where: {
                role: 'streamer',
              },
              required: false, // Sử dụng LEFT JOIN, chỉ lấy thông tin nếu user là streamer
            },
          ],
        },
      ],
    });
  } catch (error) {

  }
}

module.exports = {
  createChannel,
  followChannel,
  unFollowChannel,
}
