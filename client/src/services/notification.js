import axios from './axios';

const getAllNotifications = async () => {
  try {
    const response = await axios.get('/notification');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getQuantity = async () => {
  try {
    const response = await axios.get('notificationVisitStatus/getUnReceiveNoti');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const receivedNoti = async () => {
  try {
    const response = await axios.post('notificationVisitStatus/markAllAsRecieved');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getAllNotifications, getQuantity, receivedNoti };
