import axios from './axios';

const getBookedStatus = async (startDate, endDate) => {
  try {
    const params = {
      startDate,
      endDate,
    };
    const response = await axios.get(`/featuredContent/bookedStatus`, { params });
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
const getBookedByDate = async (datetime) => {
  try {
    const params = {
      datetime,
    };
    const response = await axios.get(`/featuredContent/getBookedByDate`, { params });
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
const postBookingContent = async (
  date,
  featuredContentBaseId,
  featuredContentAbnormalId,
  videoId,
) => {
  try {
    const data = {
      date,
      featuredContentBaseId,
      featuredContentAbnormalId,
      videoId,
    };
    const response = await axios.post('/featuredContent/booking', data);
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
export { getBookedStatus, getBookedByDate, postBookingContent };
