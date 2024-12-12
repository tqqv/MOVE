import axios from './axios';

const postLogin = async (data) => {
  try {
    const response = await axios.post('/admin/login', data);
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : { message: error.message };
    return { error: true, ...errorData };
  }
};

const getLogout = () => {
  return axios.get('/admin/logout');
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

const sendMailVerify = (data) => {
  return axios.post('/auth/mail-verify', data);
};

const acpVerifyMail = (token) => {
  return axios.get(`/auth/verify-account/${token}`);
};

export {
  postLogin,
  getLogout,
  getVerifyToken,
  postForgotPassword,
  postResetPassword,
  sendMailVerify,
  acpVerifyMail,
};
