import axios from './axios';

const getAllRepPackage = async () => {
  try {
    const response = await axios.get('/repPackage');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getAllRepPackage };
