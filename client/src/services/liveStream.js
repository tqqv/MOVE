import axios from './axios';

const createLiveStream = async (data) => {
  try {
    const response = await axios.post('/livestream', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { createLiveStream };
