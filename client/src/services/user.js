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

export { getProfile, updateProfile };
