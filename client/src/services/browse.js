import axios from './axios';

const getAllCategoriesHaveView = async () => {
  try {
    const response = await axios.get('/category/getAllView');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getMostViewOfVideo = async (currentPage, pageSize, level, category, sortBy, order) => {
  try {
    const params = {
      page: currentPage,
      ...(pageSize !== 12 && { pageSize }),
      ...(level && { level }),
      ...(category && { category }),
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    };

    const response = await axios.get('/video/getVideosByFilter', { params });
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getTopVideo = async (currentPage, pageSize, level, category, sortBy, order) => {
  try {
    const params = {
      page: currentPage,
      ...(pageSize !== 12 && { pageSize }),
      ...(level && { level }),
      ...(category && { category }),
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    };

    const response = await axios.get('/video/getTopvideo', { params });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export { getAllCategoriesHaveView, getMostViewOfVideo, getTopVideo };
