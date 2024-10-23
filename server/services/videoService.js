let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.VIMEO_CLIENT_ID, process.env.VIMEO_CLIENT_SECRET, process.env.VIMEO_ACCESS_TOKEN);
const fs = require('fs');
const db = require("../models/index.js");
const { Op } = require('sequelize');
const {  Video, Category, User, Sequelize, LevelWorkout, sequelize, Channel, Rating, Subscribe, Comment, ViewVideo } = db;

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

const updateVideoService = async (videoId, updateData) => {
  try {
    const video = await Video.update(updateData, {
      where: { id: videoId }
    });
    if (!video) {
      return {
        status: 404,
        message: 'Video updated failed',
        data: null
      };
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
      const patchURL = `${pictureResponse.metadata.connections.pictures.uri}/${pictureId}`;
      const thumbnailResponse = await setThumbnailActive(patchURL);

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
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          status: 200,
          message: 'Thumbnail uploaded successfully.',
          data: null
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
      where: { status:  "public" },
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
      status: "public"
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
    where: { id: videoId },
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
  return new Promise((resolve, reject) => {
    client.request({
      method: 'DELETE',
      path: `videos/${videoId}`,
    }, async (error) => {
      if (error) {
        reject({ status: 500, message: error.message });
      } else {
        if(!video) {
          return {
            status: 404,
            message: 'Video not found',
            data: null
          };
        }
        await video.destroy();
        resolve({ status: 200, message: 'Video deleted successfully', data: null });
      }
    });
  });
}

const getListVideoByFilter = async(page, pageSize, level, category, sortCondition) => {
  try {
    const listVideo = await Video.findAndCountAll({
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

const getTotalReps = async (videoId) => {
  return await Comment.findAll({
    where: {
      videoId: videoId
    },
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('rep')), 'totalReps']
    ],
    group: ['videoId'],
    raw: true
  });
};

const getVideoData = async (videoId) => {
  return await Video.findOne({
    where: {
      id: videoId
    },
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
            WHERE viewVideos.videoId = videoId
          )`),
          'avgViewTime'
        ]
      ]
    },
  });
};

const getAgeData = async (videoId) => {
  return await ViewVideo.findAll({
    where: {
      videoId: videoId
    },
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: []
    }],
    attributes: [
      [Sequelize.literal(`
        CASE
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) < 18 THEN '<18'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 18 AND 24 THEN '18-24'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 25 AND 34 THEN '25-34'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 35 AND 44 THEN '35-44'
          WHEN (YEAR(CURDATE()) - YEAR(viewVideoUser.dob)) BETWEEN 45 AND 54 THEN '45-54'
          ELSE '>64'
        END
      `), 'ageGroup'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['ageGroup'],
    raw: true
  });
};

const getCountryDataWithStates = async (videoId) => {
  // Lấy dữ liệu quốc gia cùng với số lượng người xem
  const countryData = await ViewVideo.findAll({
    where: { videoId: videoId },
    include: [{
      model: User,
      as: 'viewVideoUser',
      attributes: []
    }],
    attributes: [
      [Sequelize.col('viewVideoUser.country'), 'country'],
      [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
    ],
    group: ['viewVideoUser.country'],
    raw: true
  });

  // Tạo một đối tượng để lưu trữ kết quả
  const result = [];

  // Lặp qua từng quốc gia và nhóm tiểu bang
  for (const country of countryData) {
    const countryName = country['country'];

    // Lấy dữ liệu tiểu bang tương ứng cho từng quốc gia
    const states = await ViewVideo.findAll({
      where: {
        videoId: videoId
      },
      include: [{
        model: User,
        as: 'viewVideoUser',
        attributes: []
      }],
      attributes: [
        [Sequelize.col('viewVideoUser.state'), 'state'],
        [Sequelize.fn('COUNT', Sequelize.col('ViewVideo.viewerId')), 'viewerCount']
      ],
      group: ['viewVideoUser.state'],
      raw: true
    });

    // Thêm dữ liệu quốc gia và tiểu bang vào kết quả
    result.push({
      country: countryName,
      viewerCount: country.viewerCount,
      states: states.map(state => ({
        state: state['state'],
        viewerCount: state.viewerCount
      }))
    });
  }

  return result;
};


const analyticsVideoById = async(videoId, channelId) => {
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

    const [totalReps, videoData, ageData, countryData] = await Promise.all([
      getTotalReps(videoId),
      getVideoData(videoId),
      getAgeData(videoId),
      getCountryDataWithStates(videoId)
    ]);

    return {
      status: 200,
      data: {
        totalReps,
        videoData,
        viewersData: {
          ageData,
          countryData
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

const getListVideoByChannel = async(channelId, page, pageSize) => {
  try {
    const listVideo =  await Video.findAndCountAll({
      where: {channelId: channelId},
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
          // where: level ? {levelWorkout: level} : {}
        },
        {
          model: Category,
          attributes: ['title'],
          as: 'category',
          // where: category ? {title: category} : {}
        }
      ],
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
  getListVideoByChannel,
};
