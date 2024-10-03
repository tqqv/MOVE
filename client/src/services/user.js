import axios from './axios';

const getProfile = () => {
  return axios.get('/auth/getProfile');
};

const updateProfile = async (data) => {
  try {
    const response = await axios.put('/auth/editprofile', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const changePassword = async (data) => {
  try {
    const response = await axios.put('/auth/changePassword', data);
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

const requestToStreamer = async () => {
  try {
    const response = await axios.get('/auth/createRequestChannel');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getRequestStreamer = async () => {
  try {
    const response = await axios.get('/auth/getRequestChannelById');
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
};
