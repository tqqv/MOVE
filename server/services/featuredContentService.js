const { Op, fn, col, literal } = require("sequelize");
const { get } = require("../utils/redis/base/redisBaseService.js");
const db = require("../models/index.js");
const moment = require('moment-timezone');
const { Video, Livestream, FeaturedContent, FeaturedContentBase, FeaturedContentAbnormal, Channel, LevelWorkout, Category, User, sequelize } = db;


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

// const getAllFeatureContentService = async (page, pageSize) => {
//   try {
//     // Fetch featured contents with related models
//     const featuredContents = await FeaturedContent.findAndCountAll({
//       include: [
//         {
//           model: Livestream,
//           attributes: [
//             'title', 'description', 'thumbnailUrl', 'isLive',
//             [
//               sequelize.literal(`(
//                 SELECT AVG(rating) as ratings
//                 FROM ratings
//                 WHERE ratings.livestreamId = livestream.id
//               )`),
//               'ratings'
//             ]
//           ],
//           as: 'livestream',
//           include: [
//             {
//               model: Channel,
//               as: 'livestreamChannel',
//               attributes: [
//                 'id', 'channelName', 'avatar', 'isLive', 'popularCheck'
//               ],
//               include: [
//                 {
//                   model: User,
//                   attributes: ['username']
//                 },
//               ]
//             },
//             {
//               model: LevelWorkout,
//               as: 'livestreamLevelWorkout',
//               attributes: ['levelWorkout']
//             },
//             {
//               model: Category,
//               as: 'category',
//               attributes: ['title']
//             },

//           ]
//         },
//         {
//           model: Video,
//           as: 'video',
//           attributes: ['title', 'description', 'videoUrl', 'thumbnailUrl', 'viewCount', 'duration',
//             [
//               sequelize.literal(`(
//                 SELECT AVG(rating)
//                 FROM ratings
//                 WHERE ratings.videoId = video.id
//               )`),
//               'averageRating'
//             ]
//           ],
//           include: [
//             {
//               model: Channel,
//               as: 'channel',
//               attributes: ['channelName', 'avatar', 'isLive', 'popularCheck' ],
//             },
//             {
//               model: LevelWorkout,
//               as: 'levelWorkout',
//               attributes: ['levelWorkout']
//             },
//             {
//               model: Category,
//               as: 'category',
//               attributes: ['title']
//             },
//           ]
//         }
//       ],
//       offset: (page - 1) * pageSize,
//       limit: pageSize * 1,
//     });

//     if (!featuredContents.count) {
//       return {
//         status: 200,
//         message: "No featured contents exist."
//       };
//     }

//     // Now, iterate through the livestreams to get current views
//     const updatedLivestreams = await Promise.all(featuredContents.rows.map(async (content) => {
//       let currentViews;
//       if (content.livestream) {
//         currentViews = await get(`channelStreamId:${content.livestream.livestreamChannel?.dataValues?.id}:currentViews`);
//         content.livestream.currentViews = currentViews || 0; // Set current views for each livestream
//       }
//       return {
//         ...content.toJSON(),
//         currentViews,
//       };
//     }));

//     return {
//       status: 200,
//       data: {
//         updatedLivestreams,
//         totalPages: Math.ceil(featuredContents.count / pageSize)
//       },
//       message: "Get all featured contents successfully"
//     };

//   } catch (error) {
//     return {
//       status: 500,
//       data: null,
//       message: error.message || "An error occurred."
//     };
//   }
// };

const getAllFeatureContentService = async (datetime) => {
  try {
    // const currentDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

    // Fetch featured contents with related models
    const featuredContents = await FeaturedContent.findAll({
      where: {
        date: sequelize.where(
          sequelize.fn('DATE', sequelize.col('date')),
          '=',
          // currentDate
          datetime
        )
      },
      attributes: [],
      include: [
        {
          model: Channel,
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
          as: "channelBooking",
          include: [
            {
              model: Livestream,
              attributes: [
                'title', 'description', 'thumbnailUrl', 'isLive',
                [
                  sequelize.literal(`(
                    SELECT AVG(rating) as ratings
                    FROM ratings
                    WHERE ratings.livestreamId = id
                  )`),
                  'ratings'
                ]
              ],
              where: {isLive: true},
              as: "channelLivestreams",
              include: [
                {
                  model: LevelWorkout,
                  attributes: ["levelWorkout"],
                  as: "livestreamLevelWorkout",
                },
                {
                  model: Category,
                  attributes: ["title"],
                  as: "category",
                },
              ]
            },
            {
              model: User,
              attributes: ["username"]
            }
          ]
        },
        {
          model: Video,
          as:"video",
          include: [
            {
              model: Channel,
              as: 'channel',
              attributes: ['channelName', 'avatar', 'isLive', 'popularCheck',

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
                  model: User,
                  attributes: ["username"]
                },
              ]
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
          ]
        }
      ]
    });

    if (!featuredContents) {
      return {
        status: 200,
        message: "No featured contents exist."
      };
    }


    // Now, iterate through the livestreams to get current views
    const updatedLivestreams = await Promise.all(featuredContents.map(async (content) => {
      let currentViews;
      if (content.channelBooking) {
        currentViews = await get(`channelStreamId:${content.channelBooking.livestreamChannel?.dataValues?.id}:currentViews`);
        content.channelBooking.currentViews = currentViews || 0; // Set current views for each livestream
      }
      return {
        ...content.toJSON(),
        currentViews,
      };
    }));

    return {
      status: 200,
      data:
        updatedLivestreams,
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

const createBookingFeatureContentService = async (date, featuredContentBaseId, featuredContentAbnormalId, channelId, videoId) => {
  try {

    let video = await Video.findOne({
      where: {
        id: videoId
      }
    })

    if(video && video.channelId != channelId) {
      return {
        status: 400,
        data: null,
        message: "videoId not belong to channel",
      }
    }

    // !videoId, thì lấy video mới nhất của kênh đó.
    if(!date && !featuredContentBaseId && !featuredContentAbnormalId) {
      return {
        status: 400,
        data: null,
        message: "Does not exist featuredContentBaseId || featuredContentAbnormalId",
      }
    }
    const isBooked = await FeaturedContent.findOne({
      where: {
        date: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('DATE', sequelize.col('date')),
              sequelize.fn('DATE', date)
            )
          ],
          channelId
        }
      }
    });
    if (isBooked) {
      return {
        status: 400,
        message: "Already booked",
      };
    }
    const featuredContentBase = await FeaturedContentBase.findOne({where: { id: featuredContentBaseId || null }})
    const featuredContentAbnormal = await FeaturedContentAbnormal.findOne({where: { id: featuredContentAbnormalId || null }})
    if(featuredContentAbnormal) {
      console.log("come ", featuredContentAbnormal.date);
      date = featuredContentAbnormal.date
    }

    const channel = await Channel.findOne({where: { id: channelId }})

    const booker = await User.findOne({where: { id: channel.userId }})

    // Đếm số lượng booking hiện tại
    const currentBookings = await FeaturedContent.count({
      where: {
        date,
      },
    });

    const maxBookings = featuredContentAbnormal?.maxBookings || featuredContentBase?.maxBookings;

    // So sánh với giới hạn maxBookings
    if (currentBookings >= maxBookings) {
      return {
        status: 400,
        message: "Booking limit reached for the selected date",
      };
    }

    const pricePerDay = featuredContentAbnormal?.pricePerDay || featuredContentBase?.pricePerDay;
    if( booker.REPs === 0 || booker.REPs < pricePerDay ) {
      return {
        status: 400,
        message: "You don't have enough REP to bookings",
      }
    }

    const [newFeaturedContent] = await Promise.all([
      FeaturedContent.create({
        videoId,
        channelId,
        date,
        featuredContentBaseId,
        featuredContentAbnormalId
      }),
      booker.update({ REPs: booker.REPs - pricePerDay }),
      // lưu vào bảng payments
    ]);

    return {
      status: 200,
      data: newFeaturedContent,
      message: "You have successfully booking featured content"
    };
  } catch (error) {
    console.error(error);
      return {
        status: 500,
        data: null,
        message: "An error occurred while fetching bookings",
      };
  }
}

const getBookingFeatureContentService = async (startDate, endDate, channelId) => {
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    return {
      status: 400,
      data: null,
      message: "Invalid range date",
    };
  }

  try {
    const bookings = await FeaturedContent.findAll({
      attributes: [
        [fn("DATE", col("FeaturedContent.date")), "bookingDate"],
        [
          literal(`(
            SELECT COUNT(*)
            FROM featuredContents AS fc
            WHERE DATE(fc.date) = DATE(FeaturedContent.date)
          )`),
          "currentBookings",
        ],
        [
          literal(`(
            SELECT COUNT(*) > 0
            FROM featuredContents AS fc
            WHERE DATE(fc.date) = DATE(FeaturedContent.date)
              AND fc.channelId = ${channelId}
          )`),
          "isBookedByChannel",
        ],
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: FeaturedContentBase,
          as: 'featuredBase',
          required: false, // Thêm required: false để LEFT JOIN
        },
        {
          model: FeaturedContentAbnormal,
          as: 'featuredAbnormal',
          required: false, // Thêm required: false để LEFT JOIN
        },
      ],
      group: [
        "FeaturedContent.date",
        "featuredBase.id",
        "featuredAbnormal.id"
      ],
      raw: false, // Chuyển về false để giữ cấu trúc object
    });

    const defaultData = await FeaturedContentBase.findOne({
      order: [['createdAt', 'DESC']],
    });

    return {
      status: 200,
      data: { bookings, defaultData },
      message: "Successfully retrieved bookings grouped by date",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: null,
      message: "An error occurred while fetching bookings",
    };
  }
};

module.exports = {
  createFeatureContentService,
  getAllFeatureContentService,
  createBookingFeatureContentService,
  getBookingFeatureContentService
}
