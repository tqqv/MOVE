const db = require("../models/index.js");
const { User, RequestChannel } = db;
const { createChannel, generatedStreamKey } = require("./channelService.js");

const setStatusRequestChannel = async(userId, status, text) => {
  try {
    if(!status || !userId) {
      return {
        status: 400,
        message: "Not null."
      }
    }
    if( status !== "approved" || status !== "rejected" ){
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
      await createChannel(userId, user.username, user.avatar, streamKey);
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
      message: error.message
    }
  }
}

module.exports = {
  setStatusRequestChannel
}
