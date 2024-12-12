import axios from './axios';

const createCardInfo = async (data) => {
  try {
    const response = await axios.post('/payment/createCardInfor', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getCardInfo = async () => {
  try {
    const response = await axios.get('/payment/getCardInfor');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getClientSecret = async () => {
  try {
    const response = await axios.get('/payment/getClientSecret');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const deleteCardInfo = async (data) => {
  try {
    const response = await axios.delete(`/payment/${data}`);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getListRepPackage = async () => {
  try {
    const response = await axios.get('/repPackage/');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const checkout = async (data) => {
  try {
    const response = await axios.post('/payment/checkout', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getPaymentHistory = async (page, pageSize, startDate, endDate) => {
  try {
    const response = await axios.get('payment/getpaymentHistory', {
      params: {
        page,
        pageSize,
        startDate,
        endDate,
      },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

//admin
const getPaymentHistoryAdmin = async (userId, page, pageSize, startDate, endDate) => {
  try {
    const response = await axios.get(`admin/getListPaymentByUserId/${userId}`, {
      params: {
        page,
        pageSize,
        startDate,
        endDate,
      },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export {
  createCardInfo,
  getPaymentHistory,
  getCardInfo,
  getClientSecret,
  deleteCardInfo,
  getListRepPackage,
  checkout,
  getPaymentHistoryAdmin,
};
