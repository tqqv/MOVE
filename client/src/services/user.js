import axios from './axios';

const getProfile = () => {
  return axios.get('/auth/getProfile');
};

export { getProfile };
