const db = require("../models/index.js");
const { Channel, Subscribe, User } = db;


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

const subscribeChannel = async (userId, channelId) => {
  try {

    const subscribe = Subscribe.create({userId: userId, channelId: channelId})

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

const unSubscribeChannel = async (userId, channelId) => {
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
          message: "You unsubscribe failed."
      }
    }
    return {
      status: 200,
      data: null,
      message: "Unsubscribe successful."
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
    const subscribeed = await Subscribe.findAll({
      where: {
        channelId: channelId,
      },
      include: [
        {
          model: User,
          as: 'subscribeUser',
          attributes: ['username', 'avatar', 'role'],
          // required: true,
          include: [
            {
              model: Channel,
              attributes: ['channelName', 'avatar'],
              // required: false
            }
          ]
        },
      ],
    });

    return {
      status: 200,
      data: subscribeed,
      message: "Get list subscribeed successfully."
    }
  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

module.exports = {
  createChannel,
  subscribeChannel,
  unSubscribeChannel,
  listSubscribeOfChannel
}
