// useUserStore.js
import { defineStore } from 'pinia';
import { getProfile, viewFollowChannel } from '@/services/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    followers: [],
  }),
  actions: {
    async fetchUserProfile() {
      this.loading = true;
      try {
        const response = await getProfile();
        if (response.data.success) {
          this.user = response.data.data;
        } else {
          this.error = response.message;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async loadFollowers() {
      this.loading = true;
      try {
        const response = await viewFollowChannel();
        if (!response.error) {
          this.followers = response.data;
        } else {
          this.error = response.message;
        }
      } catch (error) {
        this.error = 'Failed to load followers';
      } finally {
        this.loading = false;
      }
    },
    clearUserData() {
      this.user = null;
    },
  },
});
