import axios from './axios';
const postRateVideo = async (data) => {
  try {
    const response = await axios.post('/rating/rateVideo', data);
    return response.data;
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
export { postRateVideo, getRateOfUser };
