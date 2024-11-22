const { Op } = require("sequelize");
const db = require("../models/index.js");
const { Channel, Subscribe, User, Video, Category, CategoryFollow, LevelWorkout, Livestream, sequelize } = db;


const searchCategories = async (data, page, pageSize) => {
    try {
      if (!data) {
        return {
          status: 400,
          data: null,
          message: "Data cannot be empty"
        };
      }
 
      const normalData = data.trim().toLowerCase();
      
      const categories = await Category.findAndCountAll({
        where: {
          title: { [Op.like]: `%${normalData}%` }
        },
        attributes: [
          'id',
          'imgUrl',
          'title',
          [
            sequelize.literal(`(
              SELECT SUM(viewCount)
              FROM videos AS categoryVideos
              WHERE categoryVideos.categoryId = Category.id
            )`),
            'totalViews'
          ]
        ],
        order: [
          ['title', 'ASC'],
          ['id', 'ASC']
        ],
        offset: (page - 1) * pageSize,
        limit: pageSize * 1,
      });
 
      return {
        status: 200,
        data: {
          categories,
          totalPages: Math.ceil(categories.count / pageSize)
        },
        message: "Categories fetched successfully"
      };
 
    } catch (error) {
      return {
        status: 400,
        data: null,
        message: error.message
      };
    }
};

const searchUser = async (data, page, pageSize) => {
    try {
      if (!data) {
        return {
          status: 400,
          data: null,
          message: "Data cannot be empty"
        };
      }
  
      const normalData = data.trim().toLowerCase();
      const users = await User.findAndCountAll({
        include: [
          {
            model: Channel,
            attributes: ['channelName', 'avatar', 'isLive', 'popularCheck',
              [
                sequelize.literal(`(
                  SELECT COUNT(*)
                  FROM subscribes
                  WHERE subscribes.channelId = Channel.id
                )`),
                'followCount'
              ]]
          }
        ],
        attributes: ['username', 'avatar'],
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${normalData}%` } },
            { '$Channel.channelName$': { [Op.like]: `%${normalData}%` } }
          ]
        },
        order: [
          [sequelize.literal("Channel.id IS NOT NULL"), "DESC"],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM subscribes
              WHERE subscribes.channelId = Channel.id
            )`),
            'DESC'
          ],
          ["username", "ASC"],
        ],
        offset: (page - 1) * pageSize,
        limit: pageSize * 1,
      });
  
      return {
        status: 200,
        data: {
          users,
          totalPages: Math.ceil(users.count / pageSize)
        },
        message: "Users fetched successfully"
      };
  
    } catch (error) {
      return {
        status: 400,
        data: null,
        message: error.message
      };
    }
};
  
const searchVideo = async (data, page, pageSize) => {
    try {
      if (!data) {
        return {
          status: 400,
          data: null,
          message: "Data cannot be empty"
        };
      }
  
      const normalData = data.trim().toLowerCase();
      const videos = await Video.findAndCountAll({
        where: {
          title: { [Op.like]: `%${normalData}%` },
          status: 'public'
        },
        include: [
          {
            model: Channel,
            as: 'channel',
            attributes: ['channelName', 'avatar', 'isLive', 'popularCheck']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['title']
          },
          {
            model: LevelWorkout,
            as: 'levelWorkout',
            attributes: ['levelWorkout']
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT AVG(rating)
                FROM ratings
                WHERE ratings.videoId = Video.id
              )`),
              'averageRating'
            ]
          ]
        },
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * pageSize,
        limit: pageSize * 1,
      });
  
      return {
        status: 200,
        data: {
          videos,
          totalPages: Math.ceil(videos.count / pageSize)
        },
        message: "Videos fetched successfully"
      };
    } catch (error) {
      return {
        status: 400,
        data: null,
        message: error.message
      };
    }
  };
  
module.exports = {
    searchCategories,
    searchUser, searchVideo

  }