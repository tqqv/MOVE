import { data } from 'autoprefixer';
import axios from './axios';

const searchInformation = async (searchData, quality, page) => {
  return await axios.get('channel/searchVideoChannel', {
    params: {
      data: searchData,
      limit: quality,
      offset: page,
    },
  });
};

const searchCate = async (searchData, quality, currentPage) => {
  return await axios.get('search/totalCate', {
    params: {
      data: searchData,
      page: currentPage,
      pageSize: quality,
    },
  });
};

const searchUser = async (searchData, quality, currentPage) => {
  return await axios.get('search/totalUser', {
    params: {
      data: searchData,
      page: currentPage,
      pageSize: quality,
    },
  });
};

const searchVideo = async (searchData, quality, currentPage) => {
  return await axios.get('search/totalVideo', {
    params: {
      data: searchData,
      page: currentPage,
      pageSize: quality,
    },
  });
};

export { searchInformation, searchCate, searchUser, searchVideo };
