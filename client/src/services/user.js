import axios from './axios';

const getProfile = () => {
  return axios.get('/auth/getProfile');
};

const updateProfile = async (data) => {
  try {
    const response = await axios.put('/auth/editprofile', data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
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

export { getProfile, updateProfile, changePassword };
