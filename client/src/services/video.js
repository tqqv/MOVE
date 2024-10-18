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
const getVideoSetting = async (page, pageSize) => {
  try {
    const response = await axios.get('/video/getVideosByChannel', { params: { page, pageSize } });
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
export {
  getVideobyChannel,
  getAllCategory,
  getAllLevelWorkout,
  getLevelWorkoutById,
  getCategoryById,
  getVideoSetting,
  deleteVideoById,
};
