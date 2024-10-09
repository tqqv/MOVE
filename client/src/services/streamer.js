import axios from './axios';

const getProfileChannel = () => {
  return axios.get('/channel/getProfileChannel');
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
export { getProfileChannel, updateChannelProfile, getListFollowOfChannel };
