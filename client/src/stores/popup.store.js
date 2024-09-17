// stores/popupStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
  const showLoginPopup = ref(false);
  const showSignupPopup = ref(false);
  const showForgotPasswordPopup = ref(false);

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

  return {
    showLoginPopup,
    showForgotPasswordPopup,
    openLoginPopup,
    closeLoginPopup,
    openForgotPasswordPopup,
    closeForgotPasswordPopup,
  };
});
