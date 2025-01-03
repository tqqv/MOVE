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
export { getAllDonationItems, donateInLivestream };
