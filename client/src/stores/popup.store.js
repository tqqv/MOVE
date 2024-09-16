import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
  const showLoginPopup = ref(false);
  const showSignupPopup = ref(false);
  const showForgotPasswordPopup = ref(false);
  const showChangePassword = ref(false);
  const showChangePasswordSuccess = ref(false);

  const openLoginPopup = () => {
    showLoginPopup.value = true;
  };

  const closeLoginPopup = () => {
    showLoginPopup.value = false;
  };

  const openForgotPasswordPopup = () => {
    showForgotPasswordPopup.value = true;
  };

  const closeForgotPasswordPopup = () => {
    showForgotPasswordPopup.value = false;
  };

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
    showLoginPopup,
    showForgotPasswordPopup,
    showChangePassword,
    showChangePasswordSuccess,
    openLoginPopup,
    closeLoginPopup,
    openForgotPasswordPopup,
    closeForgotPasswordPopup,
    openChangePassword,
    closeChangePassword,
    openChangePasswordSuccess,
    closeChangePasswordSuccess,
  };
});
