const db = require("../models/index.js");
const { get } = require("../utils/redis/base/redisBaseService.js");
const { Video, Livestream, FeaturedContent, Channel, LevelWorkout, Category, User, sequelize } = db;


const createFeatureContentService = async(livestreamId, videoId, startAt, expireAt) => {
  try {

    if(!livestreamId && !videoId) {
      return {
        status: 400,
        data: null,
        message: "No content exist"
      }
    }

    const newFeaturedContent = await FeaturedContent.create({
      videoId,
      livestreamId,
      startAt,
      expireAt
    });

    return {
      status: 200,
      data: newFeaturedContent,
      message: "You have successfully create featured content"
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getAllFeatureContentService = async (page, pageSize) => {
  try {
    // Fetch featured contents with related models
    const featuredContents = await FeaturedContent.findAndCountAll({
      include: [
        {
          model: Livestream,
          attributes: [
            'title', 'description', 'thumbnailUrl', 'isLive',
            [
              sequelize.literal(`(
                SELECT AVG(rating) as ratings
                FROM ratings
                WHERE ratings.livestreamId = livestream.id
              )`),
              'ratings'
            ]
          ],
          as: 'livestream',
          include: [
            {
              model: Channel,
              as: 'livestreamChannel',
              attributes: [
                'id', 'channelName', 'avatar', 'isLive', 'popularCheck'
              ],
              include: [
                {
                  model: User,
                  attributes: ['username']
                },
              ]
            },
            {
              model: LevelWorkout,
              as: 'livestreamLevelWorkout',
              attributes: ['levelWorkout']
            },
            {
              model: Category,
              as: 'category',
              attributes: ['title']
            },
           
          ]
        },
        {
          model: Video,
          as: 'video',
          attributes: ['title', 'description', 'videoUrl', 'thumbnailUrl', 'viewCount', 'duration',
            [
              sequelize.literal(`(
                SELECT AVG(rating)
                FROM ratings
                WHERE ratings.videoId = video.id
              )`),
              'averageRating'
            ]
          ],
          include: [
            {
              model: Channel,
              as: 'channel',
              attributes: ['channelName', 'avatar', 'isLive', 'popularCheck' ],
            },
            {
              model: LevelWorkout,
              as: 'levelWorkout',
              attributes: ['levelWorkout']
            },
            {
              model: Category,
              as: 'category',
              attributes: ['title']
            },
          ]
        }
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });

    if (!featuredContents.count) {
      return {
        status: 200,
        message: "No featured contents exist."
      };
    }

    // Now, iterate through the livestreams to get current views
    const updatedLivestreams = await Promise.all(featuredContents.rows.map(async (content) => {
      let currentViews;
      if (content.livestream) {
        currentViews = await get(`channelStreamId:${content.livestream.livestreamChannel?.dataValues?.id}:currentViews`);
        content.livestream.currentViews = currentViews || 0; // Set current views for each livestream
      }
      return {
        ...content.toJSON(),
        currentViews,
      };
    }));

    return {
      status: 200,
      data: {
        updatedLivestreams,
        totalPages: Math.ceil(featuredContents.count / pageSize)
      },
      message: "Get all featured contents successfully"
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message || "An error occurred."
    };
  }
};



module.exports = {
  createFeatureContentService,
  getAllFeatureContentService,
}
