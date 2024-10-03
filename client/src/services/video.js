import axios from './axios';

const getVideobyChannel = (channelId) => {
  return axios.get(`/video/channel/${channelId}`);
};
export { getVideobyChannel };
