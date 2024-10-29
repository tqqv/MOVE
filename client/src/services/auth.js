import axios from './axios';

const postSignup = async (data) => {
  try {
    const response = await axios.post('/auth/register', data);
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : { message: error.message };
    return { error: true, ...errorData };
  }
};

const postLogin = async (data) => {
  try {
    const response = await axios.post('/auth/login', data);
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : { message: error.message };
    return { error: true, ...errorData };
  }
};

const getLogout = () => {
  return axios.get('/auth/logout');
};
//send mail
const postSendMail = (data) => {
  return axios.post('/auth/mail-otp', data);
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
export {
  postSignup,
  postLogin,
  getLogout,
  getVerifyToken,
  postForgotPassword,
  postResetPassword,
  postSendMail,
};
