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

// COMMENT STREAMER
const getAllCommentOfStreamer = async (streamerId) => {
  try {
    const response = await axios.get(`/channel/comments/${streamerId}/?isResponsed=false`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getReplyCommentOfVideo = async (commentId) => {
  try {
    const response = await axios.get(`/channel/comments/?parentId=${commentId}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export {
  postComments,
  getAllComments,
  getAllChildComments,
  getAllCommentOfStreamer,
  getReplyCommentOfVideo,
};
