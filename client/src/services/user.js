import axios from './axios';

const getProfile = () => {
  return axios.get('/user/getProfile');
};

const updateProfile = async (data) => {
  try {
    const response = await axios.patch('/user/editprofile', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const changePassword = async (data) => {
  try {
    const response = await axios.put('/user/changePassword', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const viewFollowChannel = async () => {
  try {
    const response = await axios.get('/channel/getListFollower');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getViewChannel = async (username) => {
  try {
    const response = await axios.get(`/channel/viewChannel/${username}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const requestToStreamer = async () => {
  try {
    const response = await axios.get('/user/createRequestChannel');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getRequestStreamer = async () => {
  try {
    const response = await axios.get('/user/getRequestChannelById');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const postFollowChannel = async () => {
  try {
    const response = await axios.post('/channel/followChannelController');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export {
  getProfile,
  updateProfile,
  changePassword,
  viewFollowChannel,
  requestToStreamer,
  getRequestStreamer,
  getViewChannel,
  postFollowChannel,
};
