const db = require("../models/index.js");
const { get } = require("../utils/redis/base/redisBaseService.js");
const { Video, Livestream, FeaturedContent, Channel, LevelWorkout, Category, User, FeaturedContentBase, sequelize } = db;


const createFeatureContentBaseService = async (pricePerDay, maxBookings) => {
  try {

    if(!pricePerDay && !maxBookings ) {
      return {
        status: 400,
        data: null,
        message: "No content exist"
      }
    }

    const newFeaturedContentBase = await FeaturedContentBase.create({
        pricePerDay,
        maxBookings
    });

    return {
      status: 200,
      data: newFeaturedContentBase,
      message: "You have successfully create featured content base"
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getFeatureContentBaseService = async () => {
    try {
      const featuredContent = await FeaturedContentBase.findOne({
        order: [['createdAt', 'DESC']]
      });

      if (!featuredContent) {
        return {
          status: 200,
          data: null,
          message: "No featured content exists."
        };
      }

      return {
        status: 200,
        data: featuredContent,
        message: "Successfully retrieved the most recent featured content."
      };
    } catch (error) {
      return {
        status: 500,
        data: null,
        message: error.message || "An error occurred while retrieving the featured content."
      };
    }
  };


module.exports = {
  createFeatureContentBaseService,
  getFeatureContentBaseService,
}
