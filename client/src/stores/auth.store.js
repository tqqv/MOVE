import { defineStore } from 'pinia';
import { getProfile } from '@/services/user';

import { ref, computed } from 'vue';
const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore('auth', () => {
  // State
  const count = ref(0);
  const name = ref('Vit');

  // Getter
  const doubleCount = computed(() => count.value * 2);

  // actions
  function increment() {
    count.value++;
  }

  return { count, name, doubleCount, increment };
});

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLogin: false,
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
  },
});
