import axios from './axios';

const reportChannel = async (channelId, reportTypeId) => {
  try {
    const response = await axios.post('report/channel', {
      channelId,
      reportTypeId,
    });
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllReportChannelTypes = async () => {
  try {
    const response = await axios.get('report/getListReport?type=channels');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const reportLiveStream = async (livestreamId, reportTypeId) => {
  try {
    const response = await axios.post('report/livestream', {
      livestreamId,
      reportTypeId,
    });
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllReportLiveStream = async () => {
  try {
    const response = await axios.get('report/getListReport?type=livestreams');
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const reportChatMessage = async (userId, reportTypeId, content, accountId) => {
  try {
    const response = await axios.post('report/chatMessages', {
      userId,
      reportTypeId,
      content,
      accountId,
    });
    return response.data;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

//  ================= ADMIN ===================
const getAllReportVideo = async (params) => {
  try {
    const response = await axios.get('/admin/getListReportVideo', {
      params,
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllReportComment = async (params) => {
  try {
    const response = await axios.get('/admin/getListReportComment', {
      params,
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllReportLivestream = async (params) => {
  try {
    const response = await axios.get('/admin/getListReportLivestream', {
      params,
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllReportChannel = async (params) => {
  try {
    const response = await axios.get('/admin/getListReportChannel', {
      params,
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllReportAccount = async (params) => {
  try {
    const response = await axios.get('/admin/getListReportAccount', {
      params,
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getReportDetail = async (params) => {
  try {
    const response = await axios.get('/admin/getReportDetail', {
      params,
    });
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const handleReportAction = async (params) => {
  try {
    const response = await axios.post('/admin/actionReport', params);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export {
  reportChannel,
  getAllReportChannelTypes,
  getAllReportLiveStream,
  reportLiveStream,
  reportChatMessage,
  getAllReportVideo,
  getAllReportComment,
  getAllReportLivestream,
  getAllReportChannel,
  getAllReportAccount,
  getReportDetail,
  handleReportAction,
};
