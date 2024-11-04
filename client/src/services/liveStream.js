import axios from './axios';

const createLiveStream = async (data) => {
  try {
    const response = await axios.post('/livestream', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const endLiveStream = async (data) => {
  try {
    const response = await axios.post('/channel/endStream', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const updateLiveStream = async (data) => {
  try {
    const response = await axios.patch('/livestream/update', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const fetchLiveStream = async (username) => {
  try {
    const response = await axios.get(`/livestream/info/${username}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { createLiveStream, endLiveStream, updateLiveStream, fetchLiveStream };
