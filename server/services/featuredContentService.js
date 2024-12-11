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

const getAllFeatureContentService = async (datetime) => {
  try {
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

const createBookingFeatureContentService = async (pickedDates, channelId) => {
  try {
    const successBookings = [];
    const errorBookings = [];

    for (const { date, featuredContentBaseId, featuredContentAbnormalId, videoId } of pickedDates) {
      // Kiểm tra video có thuộc về channel không
      const video = await Video.findOne({
        where: { id: videoId },
      });

      if (video && video.channelId !== channelId) {
        results.push({
          status: 400,
          data: null,
          message: `videoId ${videoId} does not belong to the channel`,
        });
        continue;
      }

      // Nếu thiếu cả date, featuredContentBaseId và featuredContentAbnormalId
      if (!date && !featuredContentBaseId && !featuredContentAbnormalId) {
        results.push({
          status: 400,
          data: null,
          message: "Missing date, featuredContentBaseId, or featuredContentAbnormalId",
        });
        continue;
      }

      // Kiểm tra nếu đã được đặt lịch trước đó
      const isBooked = await FeaturedContent.findOne({
        where: {
          date: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("DATE", sequelize.col("date")),
                sequelize.fn("DATE", date)
              ),
            ],
          },
          channelId,
        },
      });

      if (isBooked) {
        errorBookings.push({
          message: `Date ${date} is already booked`,
        });
        continue;
      }

      // Lấy thông tin FeaturedContentBase và FeaturedContentAbnormal
      const featuredContentBase = await FeaturedContentBase.findOne({
        where: { id: featuredContentBaseId || null },
      });

      const featuredContentAbnormal = await FeaturedContentAbnormal.findOne({
        where: { id: featuredContentAbnormalId || null },
      });

      let bookingDate = date;
      if (featuredContentAbnormal) {
        bookingDate = featuredContentAbnormal.date;
      }

      const channel = await Channel.findOne({ where: { id: channelId } });
      const booker = await User.findOne({ where: { id: channel.userId } });

      // Kiểm tra giới hạn booking
      const currentBookings = await FeaturedContent.count({
        where: {
          date: bookingDate,
        },
      });

      const maxBookings =
        featuredContentAbnormal?.maxBookings || featuredContentBase?.maxBookings;

      if (currentBookings >= maxBookings) {
        errorBookings.push({
          message: `Booking limit reached for date ${bookingDate}`,
        });
        continue;
      }

      // Kiểm tra nếu người dùng không đủ REP
      const pricePerDay =
        featuredContentAbnormal?.pricePerDay || featuredContentBase?.pricePerDay;

      if (booker.REPs === 0 || booker.REPs < pricePerDay) {
        errorBookings.push({
          message: "You don't have enough REP for this booking",
        });
        continue;
      }
      console.log("cheasd");
      
      // Tạo booking và cập nhật REP
      const [newFeaturedContent] = await Promise.all([
        FeaturedContent.create({
          videoId,
          channelId,
          date: bookingDate,
          featuredContentBaseId,
          featuredContentAbnormalId,
        }),
        booker.update({ REPs: booker.REPs - pricePerDay }),
        // Lưu vào bảng payments (nếu cần)
      ]);

      successBookings.push({
        newFeaturedContent,
      });
    }

    return {
      status: 200,
      data: {successBookings, errorBookings},
      message: "Processed all booking requests",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      message: "An error occurred while processing bookings",
    };
  }
};

const getBookingFeatureContentService = async (startDate, endDate, channelId) => {
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    return {
      status: 400,
      data: null,
      message: "Invalid range date",
    };
  }

  try {
    // Lấy thông tin chi tiết mà không bị trùng lặp
    const detailedBookings = await FeaturedContent.findAll({
      attributes: [
        [fn("DATE", col("FeaturedContent.date")), "bookingDate"],
        [fn("COUNT", col("FeaturedContent.id")), "currentBookings"],
        [
          literal(`
            MAX(CASE WHEN EXISTS (
              SELECT 1
              FROM featuredContents AS fc
              WHERE DATE(fc.date) = DATE(FeaturedContent.date)
              AND fc.channelId = ${channelId}
            ) THEN 1 ELSE 0 END)
          `),
          "isBookedByChannel"
        ],
        [fn("MAX", col("featuredBase.maxBookings")), "baseMaxBookings"], // Dùng MAX cho cột featuredBase.maxBookings
        [fn("MAX", col("featuredAbnormal.maxBookings")), "abnormalMaxBookings"] // Dùng MAX cho cột featuredAbnormal.maxBookings
      ],
      include: [
        {
          model: FeaturedContentBase,
          as: "featuredBase",
          attributes: [] // Không cần lặp lại maxBookings trong include
        },
        {
          model: FeaturedContentAbnormal,
          as: "featuredAbnormal",
          attributes: [] // Không cần lặp lại maxBookings trong include
        }
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [literal("DATE(FeaturedContent.date)")],
      raw: true,
      order: [[literal("DATE(FeaturedContent.date)"), "ASC"]],
    });


    const defaultData = await FeaturedContentBase.findOne({
      order: [['createdAt', 'DESC']],
    });

    return {
      status: 200,
      data: { detailedBookings, defaultData },
      message: "Successfully retrieved bookings grouped by date",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: null,
      message: error.message,
    };
  }
};

const cancelBookingFeaturedContentService = async (pickedDates, channelId) => {
  try {
    const now = new Date();
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

    const successCancellations = [];
    const errorCancellations = [];

    for (const datetime of pickedDates) {
      const bookingDate = new Date(datetime);

      // Kiểm tra nếu hiện tại không sớm hơn 3 ngày so với thời gian đặt
      if (bookingDate.getTime() - now.getTime() < threeDaysInMilliseconds) {
        errorCancellations.push({
          datetime,
          message: "Cannot cancel booking within 3 days of the scheduled time.",
        });
        continue;
      }

      // Tìm booking theo ngày và kênh
      const booking = await FeaturedContent.findOne({
        where: { date: datetime, channelId },
      });

      if (booking) {
        // Lấy thông tin giá và hoàn trả REP
        let pricePerDay;
        const channel = await Channel.findOne({ where: { id: channelId } });
        const booker = await User.findOne({ where: { id: channel.userId } });

        if (booking.featuredContentAbnormalId) {
          const featuredContentAbnormal = await FeaturedContentAbnormal.findOne({
            where: { id: booking.featuredContentAbnormalId },
          });
          pricePerDay = featuredContentAbnormal.pricePerDay;
        } else {
          const featuredContentBase = await FeaturedContentBase.findOne({
            where: { id: booking.featuredContentBaseId },
          });
          pricePerDay = featuredContentBase.pricePerDay;
        }

        // Xóa booking và hoàn REP
        await booking.destroy();
        await booker.update({ REPs: booker.REPs + pricePerDay });

        successCancellations.push({
          datetime,
          message: "Booking deleted successfully.",
        });
      } else {
        errorCancellations.push({
          datetime,
          message: "No booking found to delete.",
        });
      }
    }

    return {
      status: 200,
      data: {
        successCancellations,
        errorCancellations,
      },
      message: "Processed all cancellation requests.",
    };
  } catch (error) {
    console.error("Error cancelling bookings:", error);
    return {
      status: 500,
      data: null,
      message: "An error occurred while cancelling bookings.",
    };
  }
};

const getBookDateDetailService = async (datetime) => {
  try {
    const abnormal = await FeaturedContentAbnormal.findOne({
      where: {
        date: sequelize.where(
          sequelize.fn('DATE', sequelize.col('FeaturedContentAbnormal.date')),
          '=',
          // currentDate
          datetime
        )
      },
    })
    if(abnormal) {
      const bookInfor = await FeaturedContent.findAndCountAll({
        where: {
          featuredContentAbnormalId: abnormal.id,
        },
        include:[
          {
            model: Video,
            as:'video',

            attributes:['title','description','thumbnailUrl','duration'],
            include:[
              {
                model: Category,
                as: 'category',
              },
              {
                model: LevelWorkout,
                as: "levelWorkout",
              },
            ]
          }
        ]
      })
      return {
        status: 200,
        data: {bookInfor, abnormal, datetime}
      }
    }

    const defaultData = await FeaturedContentBase.findOne({
      order: [['createdAt', 'DESC']],
    });

    const bookInfor = await FeaturedContent.findAndCountAll({
      where: {
        date: sequelize.where(
          sequelize.fn('DATE', sequelize.col('FeaturedContent.date')),
          '=',
          // currentDate
          datetime
        )
      },
      include:[
        {
          model: Video,
          as:'video',
          attributes:['title','description','thumbnailUrl','duration'],
          include:[
            {
              model: Category,
              as: 'category',
            },
            {
              model: LevelWorkout,
              as: "levelWorkout",
            },
          ]
        }
      ]
    })
    return {
      status: 200,
      data: {bookInfor, defaultData, datetime}
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: error.message
    }
  }
}



module.exports = {
  createFeatureContentService,
  getAllFeatureContentService,
  createBookingFeatureContentService,
  getBookingFeatureContentService,
  cancelBookingFeaturedContentService,
  getBookDateDetailService
}
