import axios from './axios';

const postComments = (videoId, data) => {
  return axios.post(`/comment/${videoId}`, data);
};

// GetAll comment 1 video
const getAllComments = (videoId) => {
  return axios.get(`/comment/${videoId}`);
};
// GetAll comment của 1 parent
const getAllChildComments = (parentId) => {
  return axios.get('/comment', {
    params: {
      parentId: parentId,
    },
  });
};

export { postComments, getAllComments, getAllChildComments };
