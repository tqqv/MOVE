import axios from './axios';

const postComments = (videoId, data) => {
  return axios.post(`/comment/${videoId}`, data);
};

// GetAll comment 1 video
const getAllComments = (videoId, userId, pageInfo) => {
  return axios.get(`/comment/${videoId}/${userId}`, {
    params: {
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    },
  });
};
// GetAll comment của 1 parent
const getAllChildComments = (parentId, userId, pageInfo) => {
  return axios.get(`/comment/${userId}`, {
    params: {
      parentId: parentId,
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    },
  });
};

// COMMENT STREAMER
const getAllCommentOfStreamer = async (streamerId, pageSize, currentPage, isResponsed, sortBy) => {
  try {
    const params = {
      pageSize,
      page: currentPage,
    };

    if (isResponsed !== '') {
      params.isResponsed = isResponsed;
    }
    if (sortBy !== '') {
      params.sortBy = sortBy;
    }

    const response = await axios.get(`/channel/comments/${streamerId}`, { params });
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getReplyCommentOfVideo = async (commentId, page) => {
  try {
    const response = await axios.get(`comment/?parentId=${commentId}&pageSize=5&page=${page}`);
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};
const postReactionComment = (data) => {
  return axios.post('comment/reactionComment', data);
};
export {
  postComments,
  getAllComments,
  getAllChildComments,
  getAllCommentOfStreamer,
  getReplyCommentOfVideo,
  postReactionComment,
};
