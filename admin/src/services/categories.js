import axios from './axios';

const getAllCategories = async () => {
  try {
    const response = await axios.get('/category');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getCategoryByTitle = async (title) => {
  try {
    const response = await axios.get(`/category/getCateByTitle/${title}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const getAllFollowCategories = async () => {
  try {
    const response = await axios.get('/categoryFollow/getAllInforFollow');
    return response.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const getAllCategoriesWithFollower = async () => {
  try {
    const response = await axios.get('/category/getAllView');
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const createCategory = async (data) => {
  try {
    const response = await axios.post('/category', data);
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const editCategory = async (cateId, data) => {
  try {
    const response = await axios.patch(`/category/${cateId}`, data);
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
export {
  getAllCategories,
  getCategoryByTitle,
  getAllFollowCategories,
  createCategory,
  getAllCategoriesWithFollower,
  editCategory,
};
