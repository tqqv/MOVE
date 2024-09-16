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

module.exports = {
  createChannel,
  subscribeChannel,
  listSubscribeOfChannel,
  listSubscribeOfUser
}
