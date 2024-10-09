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
export {
  getVideobyChannel,
  getAllCategory,
  getAllLevelWorkout,
  getLevelWorkoutById,
  getCategoryById,
};