import { defineStore } from 'pinia';
import { useUserStore } from './user.store';

import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: Cookies.get('role') || null,
    token: Cookies.get('token') || null,
  }),
  actions: {
    loginStart() {
      this.role = null;
      this.token = null;
    },
    loginSuccess(token, role) {
      this.token = token;
      this.role = role;

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('role', role, { expires: 7 });
      const userStore = useUserStore();
      userStore.fetchUserProfile();
      console.log('token', token);
    },
    logout() {
      this.role = null;
      this.token = null;

      Cookies.remove('token');
      Cookies.remove('role');
      const userStore = useUserStore();
      userStore.clearUserData();
    },
  },
});
