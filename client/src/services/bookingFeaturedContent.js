import axios from './axios';

const getCategoryByTitle = async (startDate, endDate) => {
  try {
    const params = {
      startDate,
      endDate,
    };
    const response = await axios.get(`/featuredContent/bookedStatus/`, { params });
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export { getCategoryByTitle };
