import axios from './axios';

const getAllDonationItems = async () => {
  try {
    const response = await axios.get('/donationItem');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const donateInLivestream = async (data) => {
  try {
    const response = await axios.post('/donate/livestream', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const createDonationItem = async (data) => {
  try {
    const response = await axios.post('/admin/createDonationItem', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const editDonationItem = async (donationId, data) => {
  try {
    const response = await axios.patch(`/admin/editDonationItem/${donationId}`, data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const deleteDonationItem = async (donationId) => {
  try {
    const response = await axios.delete(`/admin/deleteDonationItem/${donationId}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export {
  getAllDonationItems,
  donateInLivestream,
  createDonationItem,
  editDonationItem,
  deleteDonationItem,
};
