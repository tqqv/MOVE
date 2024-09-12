// useUserStore.js
import { defineStore } from 'pinia';
import { getProfile } from '@/services/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUserProfile() {
      this.loading = true;
      try {
        const response = await getProfile();
        if (response.data.success) {
          this.user = response.data.data;
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    clearUserData() {
      this.user = null;
    },
  },
});
