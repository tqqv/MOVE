const db = require("../models/index.js");
const { set } = require("../utils/redis/base/redisBaseService.js");
const StreamKeys = require("../utils/redis/key/streamKey.js");
const { Video, Rating, Livestream, sequelize } = db;


const createRatingOnVideo = async(userId, videoId, rating) => {
  try {

    if(!rating || !videoId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const foundVideo = await Video.findOne({
      where: {
        id: videoId
      }
    })

    if(!foundVideo) {
      return {
        status: 404,
        data: null,
        message: "Video not found"
      }
    }

    if(rating > 5 || rating < 0){
      return {
        status: 400,
        data: null,
        message: "Pls, only rated from 0-5 stars."
      }
    }

    const foundRating = await Rating.findOne({
      where: {
        videoId: videoId,
        userId: userId
      }
    })

    if(foundRating) {
      foundRating.rating = rating;
      await foundRating.save();

      return {
        status: 200,
        data: foundRating,
        message: "Updated rating successfully"
      }
    }else {
      const newRating = await Rating.create({
        videoId: videoId,
        userId: userId,
        rating: rating
      });

      return {
        status: 200,
        data: newRating,
        message: "You have successfully rated the video"
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const createRatingOnStream = async(userId, livestreamId, rating) => {
  try {

    if(!rating || !livestreamId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const foundStream = await Livestream.findOne({
      where: {
        id: livestreamId
      }
    })

    if(!foundStream) {
      return {
        status: 404,
        data: null,
        message: "Livestream not found"
      }
    }

    if(rating > 5 || rating < 0){
      return {
        status: 400,
        data: null,
        message: "Pls, only rated from 0-5 stars."
      }
    }

    const foundRating = await Rating.findOne({
      where: {
        livestreamId: livestreamId,
        userId: userId
      }
    })

    if(foundRating) {
      foundRating.rating = rating;
      await foundRating.save();

      const [avgRatingResult] = await Rating.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
        ],
        where: {
          livestreamId: livestreamId
        }
      });

      const avgRating = parseFloat(avgRatingResult.dataValues.avgRating || 0).toFixed(2);
      await set(StreamKeys.avgRates(foundStream.streamerId), avgRating);

      return {
        status: 200,
        data: foundRating,
        message: "Updated rating successfully"
      }
    }else {
      const newRating = await Rating.create({
        livestreamId: livestreamId,
        userId: userId,
        rating: rating
      });

      const [avgRatingResult] = await Rating.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
        ],
        where: {
          livestreamId: livestreamId
        }
      });

      const avgRating = parseFloat(avgRatingResult.dataValues.avgRating || 0).toFixed(2);
      await set(StreamKeys.avgRates(foundStream.dataValues.streamerId), avgRating);
      return {
        status: 200,
        data: newRating,
        message: "You have successfully rated the livestream"
      };
    }
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getRatingOfVideo = async(userId, videoId) => {
  try {
    const video = await Video.findOne({where: {id: videoId}})
    if(!video) {
      return {
        status: 404,
        message: "Video not found."
      }
    }

    const rate = await Rating.findOne({where: {videoId: videoId, userId: userId}})

    return {
      status: 200,
      data: rate,
      message: "Get rating of video successfully"
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getRatingOfStream = async(userId, livestreamId) => {
  try {
    const livestream = await Livestream.findOne({where: {id: livestreamId}})
    if(!livestream) {
      return {
        status: 404,
        message: "Livestream not found."
      }
    }

    const rate = await Rating.findOne({where: {livestreamId: livestreamId, userId: userId}})


    return {
      status: 200,
      data: rate,
      message: "Get rating of livestream successfully"
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
  createRatingOnVideo,
  createRatingOnStream,
  getRatingOfVideo,
  getRatingOfStream,
}
