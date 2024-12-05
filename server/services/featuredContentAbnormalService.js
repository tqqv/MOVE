const db = require("../models/index.js");
const { FeaturedContentAbnormal, sequelize } = db;


const createFeatureContentAbnormalService = async (date, pricePerDay, maxBookings) => {
  try {

    if(!date || (!pricePerDay && !maxStreams && !maxVideos) ) {
      return {
        status: 400,
        data: null,
        message: "No content exist"
      }
    }

    const newFeaturedContentAbnormal = await FeaturedContentAbnormal.create({
      date,
      pricePerDay,
      maxBookings,
    });

    return {
      status: 200,
      data: newFeaturedContentAbnormal,
      message: "You have successfully create featured content abnormal"
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getFeatureContentAbnormalService = async (date) => {
    try {
      const featuredContent = await FeaturedContentAbnormal.findAll({
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
  createFeatureContentAbnormalService,
  getFeatureContentAbnormalService,
}
