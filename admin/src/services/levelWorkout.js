import axios from './axios';

const getAllLevelWorkout = async () => {
  try {
    const response = await axios.get('/levelWorkout');
    return response;
  } catch (error) {
    return { error: true, status: error.response.status, message: error.response.data.message };
  }
};

export { getAllLevelWorkout };
