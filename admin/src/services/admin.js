import axios from './axios';

const getStatistic = async () => {
  try {
    const response = await axios.get('/admin/getStatistic');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getTop5Channel = async () => {
  try {
    const response = await axios.get('/admin/getTop5Channel');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getTop5UserDeposit = async () => {
  try {
    const response = await axios.get('/admin/getTop5UserDeposit');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getDataChartMoney = async () => {
  try {
    const response = await axios.get('/admin/getDataChartMoney');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
export { getStatistic, getTop5Channel, getTop5UserDeposit, getDataChartMoney };
