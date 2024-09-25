import axios from './axios';

const searchInformation = async (searchData) => {
  return await axios.get('channel/searchVideoChannel', {
    params: {
      data: searchData,
      limit: 5,
      offset: 0,
    },
  });
};

export { searchInformation };
