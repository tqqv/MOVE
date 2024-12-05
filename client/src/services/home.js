import axios from './axios';

const getDataSlider = async (datetime) => {
  try {
    const response = await axios.get('/featuredContent', {
      params: {
        datetime: datetime,
      },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getDataSlider };
