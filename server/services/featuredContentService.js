const { Op, fn, col, literal, where } = require("sequelize");
const { get } = require("../utils/redis/base/redisBaseService.js");
const db = require("../models/index.js");
const moment = require('moment-timezone');
const featuredContent = require("../models/featuredContent.js");
const { getFilteredSortedTopVideos } = require("../utils/redis/cache/videoCache.js");
const { Video, Livestream, FeaturedContent, FeaturedContentBase, FeaturedContentAbnormal, Channel, LevelWorkout, Category, User, Comment, Donation, Subscribe, sequelize } = db;


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

const formatResponse = (input) => {
  const videos = input.data.video.data.listVideo.rows.map(video => ({
      video: {
          id: video.id,
          channelId: video.channelId,
          categoryId: video.categoryId,
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          isCommentable: video.isCommentable,
          viewCount: video.viewCount + 1, // Incrementing view count as an example
          totalShare: video.totalShare,
          duration: video.duration,
          levelWorkoutsId: video.levelWorkout ? "1" : null, // Assuming levelWorkout maps to id "1"
          livestreamId: null, // As specified
          status: video.status,
          isBanned: video.isBanned,
          createdAt: video.createdAt,
          updatedAt: new Date().toISOString(), // Setting updatedAt to current time
          channel: {
              channelName: video.channel.channelName,
              avatar: video.channel.avatar,
              isLive: video.channel.isLive,
              popularCheck: video.channel.popularCheck,
              averageRating: video.ratings || null, // Assuming `ratings` field exists
              User: {
                  username: video.channel.User.username
              }
          },
          category: {
              title: video.category.title
          },
          levelWorkout: {
              levelWorkout: video.levelWorkout ? video.levelWorkout.levelWorkout : null
          }
      }
  }));
  return videos
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
      attributes: ["id"],
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
    if (featuredContents.length < 10) {
      const topVideos = (await getFilteredSortedTopVideos( {level: null, category: null}, "score", 1, (10 - featuredContents.length), "desc")).data.listVideo.rows.map(video => ({
        channelBooking: null,
        video: {
          id: video.id,
          channelId: video.channelId,
          categoryId: video.categoryId,
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          isCommentable: video.isCommentable,
          viewCount: video.viewCount,
          totalShare: video.totalShare,
          duration: video.duration,
          livestreamId: null,
          status: video.status,
          isBanned: video.isBanned,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          channel: {
            channelName: video.channel.channelName,
            avatar: video.channel.avatar,
            isLive: video.channel.isLive,
            popularCheck: video.channel.popularCheck,
            averageRating: null,
            User: {
              username: video.channel.User.username
            }
          },
          category: {
            title: video.category.title
          },
          levelWorkout: {
            levelWorkout: video.levelWorkout.levelWorkout
          }
        }
      }));
      return {
        status: 200,
        data: featuredContents.concat(topVideos),
        message: "Get featured contents top video."
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
      data: updatedLivestreams,
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
      data: null,
      message: error.message
    }
  }
}

const getBookingHistoryService = async (channelId, page, pageSize, startDate, endDate) => {
  try {
    const whereCondition = { channelId };

    if (startDate && endDate) {
      whereCondition.date = {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      };
    }


    const bookingHistory = await FeaturedContent.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Channel,
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
          as: "channelBooking",
          include: [
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
              model: Category,
              as: 'category',
              attributes: ['title']
            },
            {
              model: LevelWorkout,
              as: 'levelWorkout',
              attributes: ['levelWorkout']
            },
          ]
        },
        {
          model: FeaturedContentBase,
          as: "featuredBase",
          attributes: ["pricePerDay"] // Không cần lặp lại maxBookings trong include
        },
        {
          model: FeaturedContentAbnormal,
          as: "featuredAbnormal",
          attributes: ["pricePerDay"] // Không cần lặp lại maxBookings trong include
        }
      ],
      order: [["date", "DESC"]],
      offset: (page - 1) * pageSize *1,
      limit: pageSize * 1
    })

    return {
      status: 200,
      data: {
        bookingHistory,
        totalPages: Math.ceil(bookingHistory.count/pageSize)
      },
      message: "Get booking history successfully"
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getBookingStatsService = async (channelId, datetime) => {
  try {
    const featuredContent = await FeaturedContent.findAll({
      where: {
        date: sequelize.where(
          sequelize.fn('DATE', sequelize.col('date')),
          '=',
          datetime
        ),
        channelId,
      },
      attributes: [
        "clickCount",
        [
          sequelize.literal(`(
            SELECT SUM(rep)
            FROM comments AS commentReplies
            WHERE commentReplies.videoId = video.id
              AND DATE(commentReplies.createdAt) = date
          )`),
          'totalRepFromVideo',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM subscribes AS newSubscribers
            WHERE DATE(newSubscribers.createdAt) = date
          )`),
          'newSubscriptionsToday',

        ],
        [
          sequelize.literal(`(
            SELECT SUM(rep)
            FROM comments AS totalVideoRep
            WHERE totalVideoRep.videoId = video.id
          )`),
          'totalRepOfVideo',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM subscribes AS allSubscribers
            WHERE allSubscribers.channelId = channelBooking.id
          )`),
          'totalFollowers',
        ],
      ],
      include: [
        {
          model: Video,
          as: "video",
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["title"],
            },
            {
              model: LevelWorkout,
              as: "levelWorkout",
              attributes: ["levelWorkout"],
            },
            {
              model: Comment,
              as: "videoComment",
              attributes: [],
            },
          ],
        },
        {
          model: Channel,
          as: "channelBooking",
          attribute: [],
          include: [
            {
              model: Subscribe,
              as: "channelSubscriber",
              attributes: ["id"],
            },
          ]
        }
      ],
    });

    const liveInfor = await Livestream.findOne({
      where: {
        streamerId: channelId,
        createdAt: sequelize.where(
          sequelize.fn('DATE', sequelize.col('createdAt')),
          '=',
          datetime
        ),
      },
      attributes: [
        "highestViewAtSameTime", "totalView", "totalShare", "duration","thumbnailUrl","title",
        [
          sequelize.literal(`(
            SELECT SUM(reps)
            FROM donations AS streamDonator
            WHERE streamDonator.livestreamId = Livestream.id
              AND DATE(streamDonator.createdAt) = '${datetime}'
          )`),
          'totalRepFromLivestream',
        ],
      ],
      include: [
        {
          model: Donation,
          attributes: [],
          as: "streamDonator",
        },
        {
          model: Category,
          attributes: ["title"],
          as: 'category'
        },
        {
          model: LevelWorkout,
          attributes: ["levelWorkout"],
          as: 'livestreamLevelWorkout'
        },
      ],
    })

    return {
      status: 200,
      data: {featuredContent, liveInfor},
      message: "Get booking stats successfully"
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}


const increaseClickFeaturedService = async (featuredContentId) => {
  try {
    // Tìm đối tượng FeaturedContent dựa trên id
    const featuredContent = await FeaturedContent.findOne({
      where: {
        id: featuredContentId
      }
    });

    if (!featuredContent) {
      return {
        status: 404,
        message: "FeaturedContent not found"
      };
    }

    // Tăng giá trị clickCount lên 1
    await featuredContent.increment('clickCount');

    return {
      status: 200,
      message: "Click count increased successfully"
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};


module.exports = {
  createFeatureContentService,
  getAllFeatureContentService,
  createBookingFeatureContentService,
  getBookingFeatureContentService,
  cancelBookingFeaturedContentService,
  getBookingHistoryService,
  getBookingStatsService,
  getBookDateDetailService,
  increaseClickFeaturedService
}
