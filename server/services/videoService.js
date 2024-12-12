let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.VIMEO_CLIENT_ID, process.env.VIMEO_CLIENT_SECRET, process.env.VIMEO_ACCESS_TOKEN);
const fs = require('fs');
const db = require("../models/index.js");
const { Op, where } = require('sequelize');
const {  Video, Category, User, Sequelize, LevelWorkout, sequelize, Channel, Rating, Subscribe, Comment, ViewVideo, Keyword, VideoKeyword } = db;
const { v4: uuidv4 } = require('uuid');
const WEIGHTS = require('../models/enum/constants.js');
const axios = require('axios');
const { generateVideosYouMayLike } = require('../utils/AI/services/youmaylike/generateYouMayLikeVideos.js');
const { generateVideoEmbeddings } = require('../utils/AI/services/youmaylike/generateEmbeddings.js');
const { generateUserProfile } = require('../utils/AI/services/youmaylike/generateUserProfile.js');
const _redis = require('../utils/redis/config.js');
const { createNotification } = require('./notificationService.js');

const generateUploadLink = async (fileName, fileSize) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'POST',
      path: '/me/videos',
      query: {
        name: fileName,
        upload: {
          approach: 'tus',
          size: fileSize
        },
      }
    }, (error, body, statusCode) => {
      if (error) {
        reject({
          status: statusCode || 500,
          message: error.message,
          data: null
        });
      } else {
        resolve({
          status: 200,
          message: 'Upload link generated successfully.',
          data: {
            uri: body.uri,
            uploadLink: body.upload.upload_link
          }
        });
      }
    });
  });
};

const saveVideoService = async (videoId, userId, title, description, thumbnailUrl, videoUrl, duration, status) => {
  try {
    const video = await Video.create({
        id: videoId,
        channelId: userId,
        title: title,
        description: description,
        thumbnailUrl: thumbnailUrl,
        videoUrl: videoUrl,
        duration: duration,
        status: status,
    });
    if (!video) {
      return {
        status: 404,
        message: 'Video created failed',
        data: null
      };
    }
    return {
      status: 200,
      message: 'Video saved successfully',
      data: video
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      data: null
    };
  }
};

const reupStreamService = async (livestreamId, videoId, userId, title, description, thumbnailUrl, videoUrl, duration, status, categoryId, levelWorkoutsId) => {
  try {
    const video = await Video.create({
        id: videoId,
        channelId: userId,
        title: title,
        description: description,
        thumbnailUrl: thumbnailUrl,
        videoUrl: videoUrl,
        duration: duration,
        status: status,
        livestreamId,
        categoryId,
        levelWorkoutsId,
        isCommentAble: true,
    });
    if (!video) {
      return {
        status: 404,
        message: 'Video created failed',
        data: null
      };
    }
    return {
      status: 200,
      message: 'Reup video saved successfully',
      data: video
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      data: null
    };
  }
};

const updateVideoService = async (videoId, updateData) => {
  const handleKeywords = async (keywords) => {
    const keywordArray = keywords.split(',').map(k => k.trim());
    const keywordIds = [];

    for (let content of keywordArray) {
      let keyword = await Keyword.findOne({ where: { content } });
      if (!keyword) {
        keyword = await Keyword.create({
          id: uuidv4(),
          content
        });
      }
      if (keyword && keyword.id) {
        keywordIds.push(keyword.id);
      } else {
        console.warn(`Keyword not found or created for content: "${content}"`);
      }
    }
    return keywordIds;
  };

  if (updateData.keywords) {
    try {
      console.log('Processing keywords');
      const keywordIds = await handleKeywords(updateData.keywords);

      if (keywordIds.length === 0) {
        return {
          status: 400,
          message: 'No valid keywords found to associate with the video.',
          data: null,
        };
      }

      await VideoKeyword.destroy({ where: { videoId } });

      const videoKeywordPromises = keywordIds.map(keywordId =>
        VideoKeyword.create({ videoId, keywordId })
      );
      await Promise.all(videoKeywordPromises);
    } catch (error) {
      return {
        status: 500,
        message: 'An error occurred while saving keywords',
        data: null,
      };
    }
  }
  try {
    const video = await Video.update(updateData, {
      where: { id: videoId }
    });

    const videoInfor = await Video.findOne({
      where: { id: videoId }
    });

    if (!video) {
      return {
        status: 404,
        message: 'Video updated failed',
        data: null
      };
    }
    if(updateData.status == "public") {
      await createNotification(
        "followedChannel",
        "newVideo",
        null,
        videoInfor.dataValues.channelId,
        videoInfor.dataValues.channelId,
        null,
        videoId
      )
    }
    return {
      status: 200,
      message: 'Video updated successfully',
      data: video
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      data: null
    };
  }
};

const getVideoService = async (videoUri) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'GET',
      path: videoUri,
    }, (error, body, statusCode) => {
      if (error) {
        reject({
          status: statusCode || 500,
          message: error.message,
          data: null
        });
      } else {
        resolve({
          status: 200,
          message: 'Upload link generated successfully.',
          data: {
            title: body.name,
            description: body.description,
            videoUrl: body.player_embed_url,
            duration: body.duration,
            thumbnailUrl: body.pictures.base_link,
          }
        });
      }
    });
  });
}

const checkVideoStatusService = async (videoUri) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'GET',
      path: `${videoUri}?fields=uri,upload.status,transcode.status`,
    }, (error, body) => {
      if (error) {
        reject({ status: 500, message: error.message });
      }
      resolve({
        status: 200,
        message: 'Video status fetched successfully.',
        data: body
      });
    });
  });
};

const uploadThumbnailService = async (videoUri, thumbnailPath) => {
  try {
    const pictureResponse = await new Promise((resolve, reject) => {
      client.request({
        method: 'GET',
        path: `${videoUri}?fields=metadata.connections.pictures.uri`,
        query: {
          active: true,
          time: 0,
        }
      }, (error, body) => {
        if (error) {
          return reject({ status: 500, message: error.message });
        }
        resolve(body);
      });
    });

    // Get the upload link for the thumbnail
    const uploadLink =  await createThumbnailResource(pictureResponse.metadata.connections.pictures.uri);

    // Upload the thumbnail to the video
    const uploadResponse = await fetch(uploadLink, {
      method: 'PUT',
      body: fs.readFileSync(thumbnailPath),
      headers:{
        Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      }
    });
    if (!uploadResponse.ok) {
      throw { status: uploadResponse.status, message: `Error: ${uploadResponse.statusText}` };
    }

    // Set the thumbnail as active
    const responseData = await uploadResponse.json();
    const path = responseData.Path;
    if (path) {
      const pictureId = path.split('/').pop();
      const videoId = videoUri.split('/').pop();
      const patchURL = `${pictureResponse.metadata.connections.pictures.uri}/${pictureId}`;
      const thumbnailResponse = await setThumbnailActive(patchURL);
      const video = await Video.update(
        { thumbnailUrl: thumbnailResponse.data.base_link },
        { where: { id: videoId } }
      );
      // Delete the temporary thumbnail file
      fs.unlink(thumbnailPath, (err) => {
        if (err) {
          return ({
            status: 500,
            message: 'Error deleting temporary file.',
            data: null
          });
        }
      });
      return thumbnailResponse;
    }
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message,
      data: null
    };
  }
};

// This function creates a thumbnail resource
const createThumbnailResource = async (picturesUri) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'POST',
      path: picturesUri,
      query: {
        upload: {
          approach: 'tus',
        }
      }
    }, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body.link);
      }
    });
  });
};

// This function sets the thumbnail upload as active
const setThumbnailActive = (picturesUri) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'PATCH',
      path: picturesUri,
      query: {
        active: true,
        time: 0
      },
    }, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          status: 200,
          message: 'Thumbnail uploaded successfully.',
          data: body
        });
      }
    });
  });
};

const uploadMetadataService = async (videoUri, title, description) => {
  const videoId = videoUri.split('/').pop();
  const video = await Video.update({
    title: title,
    description: description
  }, {
    where: { id: videoId }
  });
  return new Promise((resolve, reject) => {
    client.request({
      method: 'PATCH',
      path: videoUri,
      query: {
        name: title,
        description: description
      }
    }, (error, body) => {
      if (error) {
        reject({ status: 500, message: error.message });
      } else {
        resolve({ status: 200, message: 'Video metadata updated successfully', data: body });
      }
    });
  });
};

const getAllVideosService = async (page, pageSize) => {
  const videos = await Video.findAll(
    {
      where: { status:  "public", isBanned: false },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT AVG(rating) as ratings
                FROM ratings
                WHERE ratings.videoId = Video.id
            )`),
            'ratings'
          ]
        ]
      },
      include: [
        {
          model: Channel,
          attributes: ['channelName', 'bio', 'avatar', 'isLive', 'popularCheck', 'facebookUrl', 'instaUrl', 'youtubeUrl',
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM subscribes
                WHERE subscribes.channelId = channel.id
              )`),
              'followCount'
            ]],
          as: 'channel',
        },
        {
          model: Category,
          as: 'category',
        },
        {
          model: LevelWorkout,
          as: "levelWorkout",
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    }
  );
  if (!videos) {
    return {
      status: 404,
      message: 'Videos not found',
      data: null
    };
  }
  return {
    status: 200,
    message: 'Videos fetched successfully',
    data: videos
  };
};

const getLatestReupStreamService = async (channelId) => {
  try {
  const video = await Video.findOne({
      where: {
        livestreamId: {
          [Op.ne]: null // Use Op.ne instead of Op.not
        },
        status: "public",
        isBanned: false
      },
      include: [
        {
          model: Channel,
          where: {
            id: channelId,
          },
          attributes: [
            'channelName', 'bio', 'avatar', 'isLive', 'popularCheck',
            'facebookUrl', 'instaUrl', 'youtubeUrl',
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM subscribes
                WHERE subscribes.channelId = channel.id
                )`),
                'followCount',
              ],
            ],
            as: 'channel',
          },
          {
            model: Category,
            as: 'category',
          },
          {
            model: LevelWorkout,
            as: "levelWorkout",
          },
        ],
        order: [['createdAt', 'DESC']], // Sắp xếp theo createdAt mới nhất
      });

  if (!video) {
    return {
      status: 404,
      message: 'Reup stream not found',
      data: null,
    };
  }

  return {
    status: 200,
    message: 'Get reup stream successfully',
    data: video,
  };
} catch (error) {
  console.log(error);

  return {
    status: 500,
    message: 'Cannot Get reup stream ',
    data: null,
  };
}
};

const getVideoByUserIdService = async (channelId, page, pageSize, level, category, sortCondition) => {
  let attributes = {};

  // handle case sort by rating avg
  if("ratings".includes(sortCondition.sortBy)) {
    attributes = {
      include: [
        [
          Sequelize.literal(`(
          SELECT AVG(rating) as ratings
              FROM ratings
              WHERE ratings.videoId = Video.id
          )`),
          sortCondition.sortBy
        ]
      ]
    }
  }

  const videos = await Video.findAndCountAll({
    where: {
      channelId: channelId,
      status: "public",
      isBanned: false
    },
    // if no rating => no calculate avg rating
    attributes: attributes,
    include: [
      {
        model: Channel,
        as: 'channel',
        attributes: ['channelName', 'avatar', 'isLive', 'popularCheck']
      },
      {
        model: LevelWorkout,
        attributes: ['levelWorkout'],
        as: "levelWorkout",
        where: level ? {levelWorkout: level} : {}
      },
      {
        model: Category,
        attributes: ['title'],
        as: 'category',
        where: category ? {title: category} : {}
      }
    ],
    order: [[sortCondition.sortBy, sortCondition.order]],
    offset: (page - 1) * pageSize,
    limit: pageSize * 1,
  });
  if (!videos) {
    return {
      status: 404,
      message: 'Videos not found',
      data: null
    };
  }
  return {
    status: 200,
    message: 'Videos fetched successfully',
    data: {
      videos,
      totalPages: Math.ceil(videos.count/pageSize)
    }
  };
};

const getVideoByVideoIdService = async (videoId) => {
  const video = await Video.findOne({
    where: { id: videoId , isBanned: false},
    attributes: {
      include: [
        [
          Sequelize.literal(`(
          SELECT AVG(rating) as ratings
              FROM ratings
              WHERE ratings.videoId = Video.id
          )`),
          'ratings'
        ]
      ]
    },
    include: [
      {
        model: Channel,
        include: [{
          model: User,
          attributes: ['username']
        }],
        attributes: ['channelName', 'bio', 'avatar', 'isLive', 'popularCheck', 'facebookUrl', 'instaUrl', 'youtubeUrl',
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM subscribes
              WHERE subscribes.channelId = channel.id
            )`),
            'followCount'
          ]],
        as: 'channel',
      },
      {
        model: Category,
        as: 'category',
      },
      {
        model: LevelWorkout,
        as: "levelWorkout",
      }
    ]
  });
  if (!video) {
    return {
      status: 404,
      message: 'Video not found',
      data: null
    };
  }
  return {
    status: 200,
    message: 'Video fetched successfully',
    data: video
  };
};

const deleteVideoService = async (videoId) => {
  const video = await Video.findOne({
    where: { id: videoId }
  });

  if (!video) {
    return {
      status: 404,
      message: 'Video not found',
      data: null
    };
  }

  const videoKeywords = await VideoKeyword.findAll({ where: { videoId } });
  const keywordIds = videoKeywords.map(vk => vk.keywordId);

  return new Promise((resolve, reject) => {
    client.request({
      method: 'DELETE',
      path: `videos/${videoId}`,
    }, async (error) => {
      if (error) {
        reject({ status: 500, message: error.message });
      } else {
        await VideoKeyword.destroy({ where: { videoId } });

        if (keywordIds.length > 0) {
          await Keyword.destroy({ where: { id: keywordIds } });
        }

        await video.destroy();
        resolve({ status: 200, message: 'Video and related keywords deleted successfully', data: null });
      }
    });
  });
};

const deleteMultipleVideosService = async (videoIds) => {
  const results = [];

  for (const videoId of videoIds) {
    try {
      const video = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        results.push({ status: 404, message: `Video ID ${videoId} not found`, data: null });
        continue;
      }

      const videoKeywords = await VideoKeyword.findAll({ where: { videoId } });
      const keywordIds = videoKeywords.map(vk => vk.keywordId);

      await VideoKeyword.destroy({ where: { videoId } });

      if (keywordIds.length > 0) {
        const linkedKeywords = await VideoKeyword.findAll({
          where: { keywordId: keywordIds }
        });

        const unlinkKeywordIds = keywordIds.filter(id =>
          !linkedKeywords.some(vk => vk.keywordId === id)
        );

        if (unlinkKeywordIds.length > 0) {
          await Keyword.destroy({ where: { id: unlinkKeywordIds } });
        }
      }

      await video.destroy();

      results.push({ status: 200, message: `Video ID ${videoId} and related keywords deleted successfully`, data: null });

      await new Promise((resolve, reject) => {
        client.request({
          method: 'DELETE',
          path: `videos/${videoId}`,
        }, (error) => {
          if (error) {
            reject({ status: 500, message: `Error deleting video ID ${videoId} from client: ${error.message}` });
          } else {
            resolve();
          }
        });
      });

    } catch (error) {
      results.push({ status: 500, message: `Error processing video ID ${videoId}: ${error.message}` });
    }
  }

  return results;
};

const getListVideoByFilter = async(page, pageSize, level, category, sortCondition) => {
  try {
    const listVideo = await Video.findAndCountAll({
      where: { status: "public", isBanned: false },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM ratings
              WHERE ratings.videoId = Video.id
            )`),
            'ratings'
          ]
        ]
      },
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck']
        },
        {
          model: LevelWorkout,
          attributes: ['levelWorkout'],
          as: "levelWorkout",
          where: level ? {levelWorkout: level} : {}
        },
        {
          model: Category,
          attributes: ['title'],
          as: 'category',
          where: category ? {title: category} : {}
        }
      ],
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });

    return {
      status: 200,
      data: {
        listVideo,
        totalPages: Math.ceil(listVideo.count/pageSize)
      },
      message: "Get list video successfully"
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getVideoData = async (videoId, days) => {
  // Tạo điều kiện thời gian linh hoạt
  const ratingsCondition = days
    ? `AND ratings.createdAt >= NOW() - INTERVAL ${days} DAY`
    : '';

  const viewVideosCondition = days
    ? `AND viewVideos.createdAt >= NOW() - INTERVAL ${days} DAY`
    : '';

  const commentsCondition = days
    ? `AND comments.createdAt >= NOW() - INTERVAL ${days} DAY`
    : '';

  return await Video.findOne({
    where: {
      id: videoId
    },
    include: [
      {
        model: LevelWorkout,
        attributes: ['levelWorkout'],
        as: "levelWorkout",
      },
      {
        model: Category,
        attributes: ['title'],
        as: 'category',
      }
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT AVG(rating)
            FROM ratings
            WHERE ratings.videoId = Video.id
            ${ratingsCondition}
          )`),
          'ratings'
        ],
        [
          sequelize.literal(`(
            SELECT AVG(viewTime)
            FROM viewVideos
            WHERE viewVideos.videoId = Video.id
            ${viewVideosCondition}
          )`),
          'avgViewTime'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(viewTime)
            FROM viewVideos
            WHERE viewVideos.videoId = Video.id
            ${viewVideosCondition}
          )`),
          'totalViewer'
        ],
        [
          sequelize.literal(`(
            SELECT SUM(rep)
            FROM comments
            WHERE comments.videoId = Video.id
            ${commentsCondition}
          )`),
          'totalReps'
        ],
      ]
    },
  });
};

const getGenderData = async (videoId, days) => {
  const whereCondition = {
    videoId,
  };

  if (days) {
    whereCondition.createdAt = {
      [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
    };
  }

  return await ViewVideo.findAll({
    where: whereCondition,
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: [] // Không cần lấy thêm thuộc tính từ User
    }],
    attributes: [
      [Sequelize.literal(`
        CASE
          WHEN viewVideoUser.gender = 'Male' THEN 'Male'
          WHEN viewVideoUser.gender = 'Female' THEN 'Female'
          ELSE 'Other'
        END
      `), 'genderGroup'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['genderGroup'] // Nhóm theo genderGroup để có thể đếm viewer
  });
};


const getAgeData = async (videoId, days) => {
  const whereCondition = {
    videoId,
  };

  if (days) {
    whereCondition.createdAt = {
      [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
    };
  }
  return await ViewVideo.findAll({
    where: whereCondition,
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: []
    }],
    attributes: [
      [Sequelize.literal(`
        CASE
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) < 18 THEN 'Under 18'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 18 AND 24 THEN '18-24'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 25 AND 34 THEN '25-34'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 35 AND 44 THEN '35-44'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 45 AND 54 THEN '45-54'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) >64 THEN '64 above'
          ELSE 'Unknown'
        END
      `), 'ageGroup'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['ageGroup'],
    raw: true
  });
};

const getCountryDataWithStates = async (videoId, days) => {
  const whereCondition = {
    videoId,
  };

  if (days) {
    whereCondition.createdAt = {
      [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
    };
  }
  const countryData = await ViewVideo.findAll({
    where: whereCondition,
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: []
    }],
    attributes: [
      [Sequelize.col('viewVideoUser.nationality'), 'nationality'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['viewVideoUser.nationality'],
    raw: true
  });

  return countryData;
};

const getStateByCountryAndVideoId = async(videoId, country, days) => {
  try {
    const whereCondition = {
      videoId,
    };

    if (days) {
      whereCondition.createdAt = {
        [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
      };
    }

    const stateData = await ViewVideo.findAll({
      where: whereCondition,
      include: [{
        model: User,
        as: 'viewVideoUser',
        attributes: [],
        where: {country: country}
      }],
      attributes: [
        [Sequelize.col('viewVideoUser.state'), 'state'],
        [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
      ],
      group: ['viewVideoUser.state'],
      raw: true
    });

    return {
      status: 200,
      data: stateData,
      message: `Get list state of ${country} successfully.`
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: error
    };
  }
}

const getDataCountryByIp = async (videoId, days) => {
  const whereCondition = {
    videoId,
  };

  if (days) {
    whereCondition.createdAt = {
      [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
    };
  }
  const countryData = await ViewVideo.findAll({
    where: whereCondition,
    attributes: [
      'country',
      [Sequelize.fn('COUNT', Sequelize.col('viewerId')), 'viewerCount']
    ],
    group: ['country'],
    raw: true
  });

  return countryData;
};

const getStateByCountryAndVideoIdFromIp = async(videoId, country, days) => {
  try {
    const whereCondition = {
      videoId,
      country
    };

    if (days) {
      whereCondition.createdAt = {
        [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
      };
    }

    const stateData = await ViewVideo.findAll({
      where: whereCondition,

      attributes: [
        'city',
        [Sequelize.fn('COUNT', Sequelize.col('city')), 'viewerCount']
      ],
      group: ['city'],
      raw: true
    });

    return {
      status: 200,
      data: stateData,
      message: `Get list city of ${country} successfully.`
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: error
    };
  }
}

const analyticsVideoById = async(videoId, channelId, days) => {
  try {
    const checkExists = await Video.findOne({
      where: {
        channelId: channelId,
        id: videoId
      }
    });

    if (!checkExists) {
      return {
        status: 404,
        data: null,
        message: "Not found"
      };
    }

    const [videoData, ageData, countryData, genderData, dataByIp] = await Promise.all([
      getVideoData(videoId, days),
      getAgeData(videoId, days),
      getCountryDataWithStates(videoId, days),
      getGenderData(videoId, days),
      getDataCountryByIp(videoId, days)
    ]);

    return {
      status: 200,
      data: {
        videoData,
        viewersData: {
          ageData,
          genderData,
          countryData,
          dataByIp
        }
      },
      message: "Get analytics by video successfully."
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: error
    };
  }
};

const getListVideoByChannel = async(channelId, page, pageSize, sortCondition, days) => {
  try {
    const whereCondition = {
      channelId,
    };

    if (days) {
      whereCondition.createdAt = {
        [Op.gte]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`)
      };
    }
    const listVideo =  await Video.findAndCountAll({
      where: whereCondition,
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM ratings
              WHERE ratings.videoId = Video.id
            )`),
            'ratings'
          ],
          [
            sequelize.literal(`(
              SELECT AVG(viewTime)
              FROM viewVideos
              WHERE viewVideos.videoId = Video.id
            )`),
            'avgViewTime'
          ],
          [
            sequelize.literal(`(
              SELECT Sum(rep)
              FROM comments
              WHERE comments.videoId = Video.id
            )`),
            'totalReps'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(viewTime)
              FROM viewVideos
              WHERE viewVideos.videoId = Video.id
            )`),
            'totalViewer'
          ],
          [
            sequelize.literal(`(
              SELECT Count(rep)
              FROM comments
              WHERE comments.videoId = Video.id && rep > 0
            )`),
            'viewerGift'
          ],
          [
            sequelize.literal(`(
              SELECT Count(videoId)
              FROM comments
              WHERE comments.videoId = Video.id
            )`),
            'totalComment'
          ],
        ],
      },
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck']
        },
        {
          model: LevelWorkout,
          attributes: ['levelWorkout'],
          as: "levelWorkout",
          // where: level ? {levelWorkout: level} : {}
        },
        {
          model: Category,
          attributes: ['title'],
          as: 'category',
          // where: category ? {title: category} : {}
        }
      ],
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });

    if(!listVideo) {
      return {
        status: 404,
        data: null,
        message: "Videos of channel not found."
      }
    }

    return {
      status: 200,
      message: 'Videos fetched successfully',
      data: {
        listVideo,
        totalPages: Math.ceil(listVideo.count/pageSize)
      }
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: error
    };
  }
};

const fetchGeoData = async(url) => {
  try {
    const res = await axios.get(url);
    const data = res.data;
    const geo = {
      country: data.location.country.name,
      city: data.location.city,
    };
    return geo;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      country: null,
      city: null
    }
  }
}

const increaseView = async(userId, videoId, ip, viewTime) => {
  try {
    const video = await Video.findOne({where: {id: videoId}})
    if(!video) {
      return {
        status: 404,
        message: "Video not found."
      }
    }

    const user = await User.findOne({where: {id: userId}})
    const checkView = await ViewVideo.findOne({where: {viewerId: userId, videoId: videoId}})
    if(!user || (user && checkView)){
      video.viewCount += 1;
      await video.save()
      return {
        status: 200,
        message: "+1 view"
      }
    }

    if(user && !checkView){
      const url = `https://api.ipregistry.co/${ip}?key=${process.env.FIND_IP_API_KEY}`;
      const res = await fetchGeoData(url)

      const viewData = await ViewVideo.create({viewerId: userId, videoId: videoId, ip: ip, country: res.country, city: res.city, viewTime: viewTime})
      video.viewCount += 1;
      await video.save()
      if(viewData) {
        return {
          status: 200,
          message: "Add viewer data successfully."
        }
      }
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const updateViewtime = async(userId, videoId, viewTime) => {
  try {
    const video = await Video.findOne({where: {id: videoId}})
    if(!video) {
      return {
        status: 404,
        message: "Video not found."
      }
    }

    const checkView = await ViewVideo.findOne({where: {viewerId: userId, videoId: videoId}})

    if(checkView && checkView.viewTime < viewTime) {
      checkView.viewTime = viewTime
      await checkView.save();
    }

    return {
      status: 200,
      message: "Update view time successfully"
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const shuffleVideos = (videos) => {
  for (let i = videos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [videos[i], videos[j]] = [videos[j], videos[i]]; // Hoán đổi vị trí
  }
  return videos;
};

const getVideoWatchAlso = async (category, level, videoId) => {
  try {
    const videos = await Video.findAll({
      where: {
        id: {
          [Op.not]: videoId,
        },
        status: 'public',
        isBanned: false
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT AVG(rating) as ratings
                FROM ratings
                WHERE ratings.videoId = Video.id
            )`),
            'ratings'
          ]
        ]
      },
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        },
        {
          model: LevelWorkout,
          attributes: ['levelWorkout'],
          as: 'levelWorkout',
          where: level ? { id: level } : {},
        },
        {
          model: Category,
          attributes: ['title'],
          as: 'category',
          where: category ? { id: category } : {},
        },
      ],
      limit: 13
    });


    if (videos.length < 14) {
      const existingVideoIds = videos.map(video => video.id);

      const additionalVideos = await Video.findAll({
        where: {
          id: {
            [Op.notIn]: [...existingVideoIds, videoId],
          },
          status: 'public',
          isBanned: false
        },
        attributes: {
          include: [
            [
              Sequelize.literal(`(
              SELECT AVG(rating) as ratings
                  FROM ratings
                  WHERE ratings.videoId = Video.id
              )`),
              'ratings'
            ]
          ]
        },
        limit: 20 - videos.length,
        include: [
          {
            model: Channel,
            as: 'channel',
            attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
            include: [
              {
                model: User,
                attributes: ['username']
              }
            ]
          },
          {
            model: LevelWorkout,
            attributes: ['levelWorkout'],
            as: 'levelWorkout',
          },
          {
            model: Category,
            attributes: ['title'],
            as: 'category',
          },
        ],
      });

      videos.push(...additionalVideos);
    }

    const listVideo = shuffleVideos(videos)

    return {
      status: 200,
      data: listVideo,
      message: 'Get video what also successfully.'
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

const renewTopVideos = async () => {
  try {
    let topVideosList = [];

    // Tìm max_view từ tất cả các video trong 10 ngày qua
    const maxView = await Video.findOne({
      attributes: [[Sequelize.fn('MAX', Sequelize.col('viewCount')), 'max_view']],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: Sequelize.literal(`DATE_SUB(NOW(), INTERVAL ${WEIGHTS.LATEST_VIDEO_DATE} DAY)`),
        },
        status: "public",
      },
    });

    // Tìm max_share từ tất cả các video trong 10 ngày qua
    const maxTotalShare = await Video.findOne({
      attributes: [[Sequelize.fn('MAX', Sequelize.col('totalShare')), 'max_totalShare']],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: Sequelize.literal(`DATE_SUB(NOW(), INTERVAL ${WEIGHTS.LATEST_VIDEO_DATE} DAY)`),
        },
        status: "public",
      },
    });

    // Tìm max_rate từ tất cả các video trong 10 ngày qua
    const maxAvgRating = await Rating.findOne({
      attributes: [
        [
          Sequelize.fn(
            'MAX',
            Sequelize.fn(
              'COALESCE',
              Sequelize.literal(`(
                SELECT AVG(rating)
                FROM ratings AS r
                INNER JOIN videos AS v ON r.videoId = v.id
                WHERE v.createdAt >= DATE_SUB(NOW(), INTERVAL ${WEIGHTS.LATEST_VIDEO_DATE} DAY)
                  AND v.status = 'public'
                GROUP BY r.videoId
                ORDER BY AVG(rating) DESC
                LIMIT 1
              )`),
              0
            )
          ),
          'max_avg_rating'
        ]
      ]
    });

    // Tìm max_commentCount từ tất cả các video trong 10 ngày qua
    const maxCommentCount = await Comment.findOne({
      attributes: [
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM comments c
          INNER JOIN videos v ON c.videoId = v.id
          WHERE v.createdAt >= DATE_SUB(NOW(), INTERVAL ${WEIGHTS.LATEST_VIDEO_DATE} DAY)
            AND v.status = 'public'
          GROUP BY c.videoId
          ORDER BY COUNT(*) DESC
          LIMIT 1
        )`), 'max_commentCount']
      ]
    });

    // Tìm max_retentionRate từ tất cả các video trong 10 ngày qua
    const maxRetentionRate = await ViewVideo.findOne({
      attributes: [
        [
          Sequelize.literal(`(
            SELECT MAX(avgRetention)
            FROM (
              SELECT
                vw.videoId,
                AVG(vw.viewTime / NULLIF(v.duration, 0)) AS avgRetention
              FROM viewVideos vw
              INNER JOIN videos v ON vw.videoId = v.id
              WHERE vw.createdAt >= DATE_SUB(NOW(), INTERVAL 10 DAY)
                AND v.status = 'public'
                AND v.duration > 0 -- Loại bỏ video có duration bằng 0
              GROUP BY vw.videoId
            ) AS retentionData
          )`),
          'max_retentionRate'
        ]
      ]
    });
    const categories = await Category.findAll();
    if (!categories || categories.length === 0) {
      return {
        status: 404,
        message: 'No categories found',
        data: null
      };
    }

    for (const category of categories) {
      const videos = await Video.findAll({
        where: {
          createdAt: {
            [Sequelize.Op.gte]: Sequelize.literal(`DATE_SUB(NOW(), INTERVAL ${WEIGHTS.LATEST_VIDEO_DATE} DAY)`),
          },
          status: "public",
          isBanned: false,
          categoryId: category.id
        },
        attributes: {
          include: [
            // Tính điểm của video dựa trên các trọng số, chuẩn hóa các yếu tố theo max value
            [
              Sequelize.literal(`(
                (Video.viewCount / ${maxView?.dataValues?.max_view || 1}) * ${WEIGHTS.VIEW} +
                (
                  COALESCE((SELECT COUNT(*) FROM comments WHERE comments.videoId = Video.id), 0)
                  / ${maxCommentCount?.dataValues?.max_commentCount || 1}
                ) * ${WEIGHTS.COMMENT} +
                (COALESCE(Video.totalShare, 0) / ${maxTotalShare?.dataValues?.max_totalShare || 1}) * ${WEIGHTS.SHARE} +
                (
                  COALESCE((SELECT AVG(rating) FROM ratings WHERE ratings.videoId = Video.id), 0)
                  / ${maxAvgRating?.dataValues?.max_avg_rating || 1}
                ) * ${WEIGHTS.RATE} +
                (
                  COALESCE(
                  (
                    SELECT AVG(vw.viewTime / NULLIF(v.duration, 0))
                    FROM viewVideos vw
                    INNER JOIN videos v ON vw.videoId = v.id
                    WHERE vw.videoId = Video.id
                  ), 0) / ${maxRetentionRate?.dataValues?.max_retentionRate || 1}
                ) * ${WEIGHTS.RETENTION_RATE}
              )`),
              'score'
            ],
            [
              Sequelize.literal(`
                COALESCE(
                  (SELECT AVG(rating) as ratings
                  FROM ratings
                  WHERE ratings.videoId = Video.id),
                  0
                )
              `),
              'ratings'
            ]
          ],
        },
        order: [[Sequelize.literal('score'), 'DESC']],
        limit: 5,
        include: [
          {
            model: Comment,
            as: 'videoComment',
            attributes: [],
          },
          {
            model: Channel,
            as: 'channel',
            attributes: ['channelName', 'avatar', 'isLive', 'popularCheck'],
            include: [
              {
                model: User,
                attributes: ['username'],
              },
            ]
          },
          {
            model: LevelWorkout,
            attributes: ['levelWorkout'],
            as: "levelWorkout",
          },
          {
            model: Category,
            attributes: ['title'],
            as: 'category',
          },
          {
            model: ViewVideo,
            attributes: [],
            as: 'viewVideo',
          }
        ],
      });

      // Lưu top video của category vào mảng kết quả
      topVideosList.push({
        categoryName: category.title,
        videos,
      });
    }
    return {
      status: 200,
      message: 'Top videos fetched successfully',
      data: topVideosList,
    };
  } catch (error) {
    console.error('Error in renewTopVideos:', error);
    return {
      status: 500,
      message: 'Error fetching top videos',
      data: null,
    };
  }
};

const getVideoYouMayLikeService = async (userId, page = 1, pageSize = 10, sortCondition = null) => {
  try {
    // 1. Embedding video
    const videoEmbeddings = await generateVideoEmbeddings();

    if (!videoEmbeddings || videoEmbeddings.length === 0) {
      throw new Error('Video embeddings not generated or empty');
    }

    // 2. User profile
    const userProfile = await generateUserProfile(userId, videoEmbeddings);

    if (!userProfile || userProfile.length === 0) {
      throw new Error('User profile not generated or empty');
    }

    console.log('User profile dimension:', userProfile.length);

    // 3. Generate video recommendations
    const youMayLikeVideosList = generateVideosYouMayLike(userProfile, videoEmbeddings);

    if (!youMayLikeVideosList || youMayLikeVideosList.length === 0) {
      return {
        status: 200,
        message: 'No recommended videos available',
        data: {
          listVideo: {
            count: 0,
            rows: [],
          },
        },
      };
    }

    // 4. Extract video IDs and fetch details from Redis
    const videoIds = youMayLikeVideosList.map(video => video.videoId);
    const videosDetails = await _redis.hmget('topvideo:details', videoIds);

    // 5. Enrich video data
    const enrichedVideosList = youMayLikeVideosList.map((video, index) => {
      const details = videosDetails[index] ? JSON.parse(videosDetails[index]) : {};
      return {
        ...video,
        ...details,
        id: video.videoId, // Map videoId to id for consistency
        videoId: undefined, // Remove videoId
      };
    });

    return {
      status: 200,
      message: 'You may like videos fetched successfully',
      data: {
        listVideo: {
          count: enrichedVideosList.length,
          rows: enrichedVideosList,
        },
      },
    };
  } catch (error) {
    console.error('Error in youMayLikeVideosList:', error.message);

    return {
      status: 500,
      message: `Error fetching recommended videos: ${error.message}`,
      data: null,
    };
  }
};

module.exports = {
  generateUploadLink,
  uploadThumbnailService,
  uploadMetadataService,
  saveVideoService,
  getVideoService,
  checkVideoStatusService,
  updateVideoService,
  getAllVideosService,
  getVideoByUserIdService,
  getVideoByVideoIdService,
  deleteVideoService,
  getListVideoByFilter,
  analyticsVideoById,
  getStateByCountryAndVideoId,
  getListVideoByChannel,
  increaseView,
  updateViewtime,
  getVideoWatchAlso,
  deleteMultipleVideosService,
  getStateByCountryAndVideoIdFromIp,
  renewTopVideos,
  getVideoYouMayLikeService,
  fetchGeoData,
  reupStreamService,
  getLatestReupStreamService
};
