const db = require("../models/index.js");
const livestream = require("../models/livestream.js");
const { set } = require("../utils/redis/base/redisBaseService.js");
const { getNumOfConnectInRoom } = require("./socketService.js");
const { Livestream, Donation, Rating, Channel, Sequelize } = db;

const createLivestream = async(data) => {
  try {
    if(!data){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }
    const newLiveStream = await Livestream.create(data);
    const channel = await Channel.findOne({
      where: {id: newLiveStream.streamerId}
    })
    channel.isLive = true;
    channel.save();

    _io.to(channel.id).emit('socketLiveStatus', 'streamPublished');
    await set(`channel_${channel.id}_live_status`, 'streamPublished');
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

const getLivestreamService = async (streamId) => {
  try {
    const livestream = await Livestream.findOne({
      where: { id: streamId }
    });
    const channel = await Channel.findOne({
      where: { id: livestream.streamerId },
    });
    // get view count
    return {
      status: 200,
      data: {channel, livestream},
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

module.exports = {
  getLivestreamService,
  createLivestream,
  getLivestreamStatistics,
  updateLivestream
}
