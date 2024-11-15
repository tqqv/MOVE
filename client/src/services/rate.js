import axios from './axios';
// RATE VIDEO

const postRateVideo = async (data) => {
  try {
    const response = await axios.post('/rating/rateVideo', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getRateOfUser = async (videoId) => {
  try {
    const response = await axios.get(`/rating/getRatingOfVideo/${videoId}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
// RATE STREAM
const postRateStream = async (data) => {
  try {
    const response = await axios.post('/rating/rateStream', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getRateStreamOfUser = async (livestreamId) => {
  try {
    const response = await axios.get(`/rating/getRatingOfStream/${livestreamId}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export { postRateVideo, getRateOfUser, postRateStream, getRateStreamOfUser };
