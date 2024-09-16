import axios from './axios';

const getProfile = () => {
  return axios.get('/auth/getProfile');
};

const updateProfile = (data) => {
  return axios.put('/auth/updateProfile', data);
};

export { getProfile, updateProfile };
