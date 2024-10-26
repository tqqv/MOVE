import axios from './axios';

const getProfileChannel = () => {
  return axios.get('/channel/getProfileChannel');
};
const getViewChannel = async (username) => {
  try {
    const response = await axios.get(`/channel/viewChannel/${username}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const updateChannelProfile = async (data) => {
  try {
    const response = await axios.put('/channel/editChannel', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getListFollowOfChannel = async (channelId) => {
  try {
    const response = await axios.get(`/channel/getListFollowed/${channelId}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getStreamKey = async () => {
  try {
    const response = await axios.get('/channel/createStreamKey');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export {
  getProfileChannel,
  updateChannelProfile,
  getListFollowOfChannel,
  getViewChannel,
  getStreamKey,
};
