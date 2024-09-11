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
    const subscribe = Subscribe.create({userId: userId, channelId: channelId})
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
    const subscribe = Subscribe.destroy({
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

module.exports = {}
