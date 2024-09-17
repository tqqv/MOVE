import axios from './axios';

const postSignup = (data) => {
  return axios.post('/auth/register', data);
};

const postLogin = (data) => {
  return axios.post('/auth/login', data);
};

const getLogout = () => {
  return axios.get('/auth/logout');
};
const getLoginGoogle = () => {
  return axios.get('/auth/google');
};
export { postSignup, postLogin, getLogout, getLoginGoogle };
