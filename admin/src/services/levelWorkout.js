import axios from './axios';

const getAllLevelWorkout = async () => {
  try {
    const response = await axios.get('/levelWorkout');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const getAllLevelWorkoutByAdmin = async () => {
  try {
    const response = await axios.get('/levelWorkout/getAllLevelWorkoutAdmin');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const createLevelWorkout = async (data) => {
  try {
    const response = await axios.post('/levelWorkout', data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const editLevelWorkout = async (levelWorkoutId, data) => {
  try {
    const response = await axios.patch(`/levelWorkout/${levelWorkoutId}`, data);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

const deleteLevelWorkout = async (levelWorkoutId) => {
  try {
    const response = await axios.delete(`/levelWorkout/${levelWorkoutId}`);
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export {
  getAllLevelWorkout,
  getAllLevelWorkoutByAdmin,
  createLevelWorkout,
  editLevelWorkout,
  deleteLevelWorkout,
};
