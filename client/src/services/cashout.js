import axios from './axios';

const createWithdrawInfor = async (bankData) => {
  try {
    const response = await axios.post('/cashout/createWithdrawInfor', { bankData });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getWithdrawInfor = async () => {
  try {
    const response = await axios.get('/cashout/getWithdrawInfor');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getLinkStripeVerify = async () => {
  try {
    const response = await axios.get('/cashout/createLinkStripeVerify');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const updateStripeVerify = async () => {
  try {
    const response = await axios.post('/cashout/updateStripeVerify');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const createPayout = async (rep) => {
  try {
    const response = await axios.post('/cashout/createPayout', { rep });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const removeWithdrawInfor = async (stripeBankId) => {
  try {
    const response = await axios.delete(`/cashout/deleteWithdrawInfor/${stripeBankId}`);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const sendMail = async () => {
  try {
    const response = await axios.get('/cashout/sendMailOtp');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const verifyOtp = async (otp) => {
  try {
    const response = await axios.get(`/cashout/verifyOtp/${otp}`);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getCashoutHistory = async (page, pageSize, startDate, endDate, status) => {
  try {
    const response = await axios.get('cashout/getListCashoutHistory', {
      params: {
        page,
        pageSize,
        startDate,
        endDate,
        status,
      },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const createExchange = async (rep) => {
  try {
    const response = await axios.post('/cashout/exchange', { rep });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getSystemConfigByKey = async () => {
  try {
    const response = await axios.get('cashout/getSystemConfigByKey/withdrawRate', {});
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export {
  createWithdrawInfor,
  getWithdrawInfor,
  getLinkStripeVerify,
  updateStripeVerify,
  createPayout,
  removeWithdrawInfor,
  sendMail,
  verifyOtp,
  getCashoutHistory,
  createExchange,
  getSystemConfigByKey,
};
