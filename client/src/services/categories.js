import axios from './axios';

const getAllCategories = async () => {
  try {
    const response = await axios.get('/category');
    return response.data;
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
export { getAllCategories, getCategoryByTitle, getAllFollowCategories };
