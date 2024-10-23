const db = require("../models/index.js");
const { Video, Rating, Livestream } = db;


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

    if(rating > 5 && rating < 0){
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

    if(rating > 5 && rating < 0){
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

      return {
        status: 200,
        data: newRating,
        message: "You have successfully rated the livestream"
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

module.exports = {
  createRatingOnVideo,
  createRatingOnStream,
}
