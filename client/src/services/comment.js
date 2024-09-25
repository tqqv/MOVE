import axios from './axios';

const postComments = (videoId, data) => {
  return axios.post(`/comment/${videoId}`, data);
};

// GetAll comment 1 video
const getAllComments = (videoId, pageInfo) => {
  return axios.get(`/comment/${videoId}`, {
    params: {
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    },
  });
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
