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

export { createCardInfo, getCardInfo, getClientSecret, deleteCardInfo };
