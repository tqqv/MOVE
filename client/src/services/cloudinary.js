import axios from 'axios';
import { toast } from 'vue3-toastify';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg9imqwrd/image/upload';

export const uploadAvatar = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_KEY);
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data;
  } catch (error) {
    toast.error('Please select the correct image file');
    throw error;
  }
};
