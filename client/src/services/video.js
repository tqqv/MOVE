import axios from './axios';

const getVideobyChannel = (channelId, page, pageSize, sortBy, order, level, category) => {
  return axios.get(`/video/channel/${channelId}`, {
    params: {
      page,
      pageSize,
      sortBy,
      order,
      level,
      category,
    },
  });
};
const getAllVideos = (page, pageSize) => {
  return axios.get('/video', {
    params: {
      page,
      pageSize,
    },
  });
};
const getVideoAnalyticsById = async (videoId) => {
  try {
    const response = await axios.get(`/video/getVideoAnalytics/${videoId}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
const getVideoSetting = async (page, pageSize, sortBy, order, days) => {
  try {
    const response = await axios.get('/video/getVideosByChannel', {
      params: { page, pageSize, sortBy, order, days },
    });
    return response.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
const getStateByCountry = async (videoId, country) => {
  try {
    const response = await axios.get(`/video/getState/${videoId}`, {
      params: { country },
    });
    return response.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
const getAllCategory = async () => {
  try {
    const response = await axios.get('/category');
    return response.data;
  } catch (error) {
    return { error: true, message: error.response.data.message };
  }
};
const getAllLevelWorkout = async () => {
  try {
    const response = await axios.get('/levelWorkout');
    return response.data;
  } catch (error) {
    return { error: true, message: error.response.data.message };
  }
};
const getLevelWorkoutById = async (lvWorkoutId) => {
  try {
    const response = await axios.get(`/levelWorkout/getLvWorkoutById/${lvWorkoutId}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response.data.message };
  }
};
const getCategoryById = async (cateId) => {
  try {
    const response = await axios.get(`/category/getCateById/${cateId}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response.data.message };
  }
};
const deleteVideoById = async (videoId) => {
  try {
    const response = await axios.delete(`video/delete-video/${videoId}`);
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
const getVideoById = async (videoId) => {
  try {
    const response = await axios.get(`/video/${videoId}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
export {
  getVideobyChannel,
  getAllCategory,
  getAllLevelWorkout,
  getLevelWorkoutById,
  getCategoryById,
  getAllVideos,
  getVideoSetting,
  deleteVideoById,
  getVideoById,
  getVideoAnalyticsById,
  getStateByCountry,
};
