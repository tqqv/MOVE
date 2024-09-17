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
//Forgot
const getVerifyToken = (token) => {
  return axios.get(`/auth/verify-token/${token}`);
};

const postForgotPassword = (data) => {
  return axios.post('/auth/forgot-password', data);
};
const postResetPassword = (data) => {
  return axios.post('/auth/reset-password', data);
};
export { postSignup, postLogin, getLogout, getVerifyToken, postForgotPassword, postResetPassword };
