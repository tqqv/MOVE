import { defineStore } from 'pinia';
import { getProfile, viewFollowChannel } from '@/services/user';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const followers = ref([]);
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

  const loadFollowers = async () => {
    loading.value = true;
    try {
      const response = await viewFollowChannel();
      if (!response.error) {
        followers.value = response.data;
      } else {
        error.value = response.message;
      }
    } catch (error) {
      error.value = 'Failed to load followers';
    } finally {
      loading.value = false;
    }
  };

  const clearUserData = () => {
    user.value = null;
  };
  const getUser = () => user.value;
  return {
    user,
    loading,
    error,
    followers,
    loadFollowers,
    fetchUserProfile,
    clearUserData,
    getUser,
  };
});
