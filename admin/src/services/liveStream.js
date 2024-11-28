import axios from './axios';

const createLiveStream = async (data) => {
  try {
    const response = await axios.post('/livestream', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const endLiveStream = async (data) => {
  try {
    const response = await axios.post('/channel/endStream', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const updateLiveStream = async (data) => {
  try {
    const response = await axios.patch('/livestream/update', data);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const fetchLiveStreamByStreamer = async (username) => {
  try {
    const response = await axios.get(`/livestream/info/${username}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const fetchViewLiveStreamByUsername = async (username) => {
  try {
    const response = await axios.get(`/livestream/${username}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getLiveStream = async (currentPage, pageSize, level, category, sortBy, order) => {
  try {
    const params = {
      page: currentPage,
      ...(pageSize !== 12 && { pageSize }),
      ...(level && { level }),
      ...(category && { category }),
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    };

    const response = await axios.get('/livestream/all', { params });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getAllLivestreamSession = async (page, pageSize) => {
  try {
    const response = await axios.get('/livestream/streamSessions', {
      params: {
        page,
        pageSize,
      },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getLiveStreamAnalytics = async (livestreamId, days) => {
  try {
    const response = await axios.get(`/livestream/streamDetails/${livestreamId}`, {
      params: { days },
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const getStateFromIP = async (livestreamId, country) => {
  try {
    const response = await axios.get(`/livestream/getStateFromIP/${livestreamId}`, {
      params: { country },
    });
    return response;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
export {
  createLiveStream,
  endLiveStream,
  updateLiveStream,
  fetchLiveStreamByStreamer,
  fetchViewLiveStreamByUsername,
  getLiveStream,
  getAllLivestreamSession,
  getLiveStreamAnalytics,
  getStateFromIP,
};
