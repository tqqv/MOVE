import axios from './axios';

const getAllCategories = async () => {
  try {
    const response = await axios.get('/category');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getAllCategories };
