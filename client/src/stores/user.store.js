import { defineStore } from 'pinia';
import { getBanned, getProfile, viewFollowChannel } from '@/services/user';
import { ref } from 'vue';
import { getAllFollowCategories } from '@/services/categories';

export const useUserStore = defineStore('user', () => {
  const user = ref({});
  const loading = ref(false);
  const error = ref(null);
  const followers = ref([]);
  const followCategories = ref([]);
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

  const fetchUserBanned = async () => {
    loading.value = true;
    try {
      const response = await getBanned();
      if (response.data.success) {
        user.value.banned = response.data.data;
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

  const loadFollowCategories = async () => {
    loading.value = true;
    try {
      const response = await getAllFollowCategories();
      if (!response.error) {
        followCategories.value = response.data.rows;
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

  return {
    user,
    loading,
    error,
    followers,
    followCategories,
    loadFollowers,
    fetchUserProfile,
    loadFollowCategories,
    clearUserData,
    fetchUserBanned,
  };
});
