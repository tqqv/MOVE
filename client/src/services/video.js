import axios from './axios';

const getVideobyChannel = (channelId, page, pageSize, sortBy, order, level, category) => {
  return axios.get(`/video/channel/${channelId}`, {
    params: {
      page,
      pageSize,
      sortBy,
      order,
      level,
      category,
    },
  });
};
export { getVideobyChannel };
