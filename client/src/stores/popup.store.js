import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
  const showChangePassword = ref(false);
  const showChangePasswordSuccess = ref(false);

  const openChangePassword = () => {
    showChangePassword.value = true;
  };

  const closeChangePassword = () => {
    showChangePassword.value = false;
  };

  const openChangePasswordSuccess = () => {
    showChangePasswordSuccess.value = true;
  };

  const closeChangePasswordSuccess = () => {
    showChangePasswordSuccess.value = false;
  };
  return {
    showChangePassword,
    showChangePasswordSuccess,
    openChangePassword,
    openChangePasswordSuccess,
    closeChangePassword,
    closeChangePasswordSuccess,
  };
});
