import axios from './axios';

const getDataSlider = async () => {
  try {
    const response = await axios.get('/featuredContent');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getDataSlider };
