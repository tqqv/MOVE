import axios from './axios';

const getProfile = () => {
  return axios.get('/user/getProfile');
};

const getAllUsersRequest = async (page, pageSize) => {
  try {
    const response = await axios.get(`/admin/requestChannel`, {
      params: { page, pageSize },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getProfilebyUsername = async (username) => {
  try {
    const response = await axios.get(`/user/getProfileByUsername/${username}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
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
    const response = await axios.get('/user/getListFollower');
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
const postFollowChannel = async (data) => {
  try {
    const response = await axios.post('/user/followChannel', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getListFollowOfUser = async () => {
  try {
    const response = await axios.get('/user/getListFollower');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
///cate
const postFollowCate = async (data) => {
  try {
    const response = await axios.post('/user/followCategory', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getCheckFollowCate = async (cateId) => {
  try {
    const response = await axios.get(`/user/checkUserFollowCate/${cateId}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export {
  getProfile,
  getCheckFollowCate,
  updateProfile,
  changePassword,
  viewFollowChannel,
  requestToStreamer,
  getRequestStreamer,
  postFollowChannel,
  getListFollowOfUser,
  getProfilebyUsername,
  postFollowCate,
  getAllUsersRequest,
};
