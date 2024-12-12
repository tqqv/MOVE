import axios from './axios';

const getAllNotifications = async (params) => {
  try {
    const response = await axios.get('/notification', { params });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllNotificationsUnRead = async (params) => {
  try {
    const response = await axios.get('/notification/unRead', { params });
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

const makeAllAsRead = async () => {
  try {
    const response = await axios.post('notificationVisitStatus/markAllAsRead');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const makeAsReadOne = async (notificationId) => {
  try {
    const response = await axios.post(`notificationVisitStatus/markAsRead/${notificationId}`);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllRoomNotifications = async () => {
  try {
    const response = await axios.get('notificationRoomSetting');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export {
  getAllNotifications,
  getQuantity,
  receivedNoti,
  makeAllAsRead,
  makeAsReadOne,
  getAllNotificationsUnRead,
  getAllRoomNotifications,
};
