import { defineStore } from 'pinia';
import { getProfile } from '@/services/user';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchUserProfile = async () => {
    loading.value = true;
    try {
      const response = await getProfile();
      if (response.data.success) {
        user.value = response.data.data;
      } else {
        throw new Error('Invalid token');
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const clearUserData = () => {
    user.value = null;
  };

  return { user, loading, error, fetchUserProfile, clearUserData };
});
