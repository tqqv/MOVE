import axios from './axios';

const getAllRepPackage = async () => {
  try {
    const response = await axios.get('/repPackage');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const createRepPackage = async (data) => {
  try {
    const response = await axios.post('/admin/createRepPackage', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const editRepPackage = async (repId, data) => {
  try {
    const response = await axios.patch(`/admin/editRepPackage/${repId}`, data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const deleteRepPackage = async (repId) => {
  try {
    const response = await axios.delete(`/admin/deleteRepPackage/${repId}`);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getAllRepPackage, createRepPackage, editRepPackage, deleteRepPackage };
