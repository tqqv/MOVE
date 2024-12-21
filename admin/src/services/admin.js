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
const getDataChartMoney = async (year) => {
  try {
    const response = await axios.get('/admin/getDataChartMoney', {
      params: { year },
    });
    return response;
  } catch (error) {
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
    };
  }
};
const getDataUserType = async (year) => {
  try {
    const response = await axios.get('/admin/userCount');
    return response;
  } catch (error) {
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
    };
  }
};

// REVENUE
const getRevenue = async (year) => {
  try {
    const response = await axios.get(`/admin/revenue`, {
      params: { year },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getListUserPayIn = async (page, pageSize) => {
  try {
    const response = await axios.get(`/admin/getListUserPayIn`, {
      params: { page, pageSize },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getListUserPayOut = async (page, pageSize) => {
  try {
    const response = await axios.get(`/admin/getListUserPayOut`, {
      params: { page, pageSize },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export {
  getStatistic,
  getTop5Channel,
  getTop5UserDeposit,
  getDataChartMoney,
  getDataUserType,
  getRevenue,
  getListUserPayIn,
  getListUserPayOut,
};
