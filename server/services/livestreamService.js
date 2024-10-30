const db = require("../models/index.js");
const livestream = require("../models/livestream.js");
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

    _io.to(data.streamerId).emit('streamPublished', true);
    await _redis.set(`channel_${channel.id}_live_status`, 'streamPublished');
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

const endLivestream = async(livestreamId) => {
  try {
    if(!livestreamId){
      return {
        status: 400,
        data: null,
        message: 'Invalid livestreamId'
      }
    }
    const liveStream = await Livestream.findOne(
      {
        where: { id: livestreamId },
        include: [
          {
            model: Channel,
            as: 'livestreamChannel',
            attributes: ['id', 'isLive', 'channelName']
          },
        ]
      }
    )

    if (!liveStream) {
      return {
        status: 404,
        data: null,
        message: 'Livestream not found'
      };
    }

    liveStream.livestreamChannel.isLive = false;
    await liveStream.livestreamChannel.save();
    await _redis.set(`channel_${liveStream.livestreamChannel.id}_live_status`, 'streamReady');

    ///
    // Logic update stats from redis here
    ///
    liveStream.save();
    _io.to(liveStream.streamerId).emit('streamPublished', false);
    return {
      status: 200,
      data: liveStream,
      message: 'End livestream successfully'
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

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
  createLivestream,
  getLivestreamStatistics,
  endLivestream
}
