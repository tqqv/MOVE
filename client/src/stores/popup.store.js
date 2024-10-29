import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
  const showLoginPopup = ref(false);
  const showSignupPopup = ref(false);
  const showForgotPasswordPopup = ref(false);
  const showChangePassword = ref(false);
  const showChangePasswordSuccess = ref(false);
  const showVideoDetailPopup = ref(false);
  const showUploadVideoPopup = ref(false);
  const showConfirmDialog = ref(false);
  const showReportChannel = ref(false);
  const showReportSuccess = ref(false);
  const showVerifyPopup = ref(false);
  const openVerifyPopup = () => {
    showVerifyPopup.value = true;
  };

  const closeVerifyPopup = () => {
    showVerifyPopup.value = false;
  };
  const openConfirmDialog = () => {
    showConfirmDialog.value = true;
  };

  const closeConfirmDialog = () => {
    showConfirmDialog.value = false;
  };

  const openVideoDetailPopup = () => {
    showVideoDetailPopup.value = true;
  };

  const closeVideoDetailPopup = () => {
    showVideoDetailPopup.value = false;
  };

  const openUploadVideoPopup = () => {
    showUploadVideoPopup.value = true;
  };

  const closeUploadVideoPopup = () => {
    showUploadVideoPopup.value = false;
  };

  const openSignupPopup = () => {
    showSignupPopup.value = true;
  };

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

  const openReportChannel = () => {
    showReportChannel.value = true;
  };

  const closeReportChannel = () => {
    showReportChannel.value = false;
  };

  const openReportSuccess = () => {
    showReportSuccess.value = true;
  };

  const closeReportSuccess = () => {
    showReportSuccess.value = false;
  };

  return {
    showVerifyPopup,
    showLoginPopup,
    showForgotPasswordPopup,
    showChangePassword,
    showChangePasswordSuccess,
    showVideoDetailPopup,
    showUploadVideoPopup,
    showConfirmDialog,
    showReportChannel,
    showReportSuccess,
    openLoginPopup,
    closeLoginPopup,
    openForgotPasswordPopup,
    closeForgotPasswordPopup,
    openChangePassword,
    closeChangePassword,
    openChangePasswordSuccess,
    closeChangePasswordSuccess,
    openVideoDetailPopup,
    closeVideoDetailPopup,
    openUploadVideoPopup,
    closeUploadVideoPopup,
    openConfirmDialog,
    closeConfirmDialog,
    openSignupPopup,
    openReportChannel,
    closeReportChannel,
    openReportSuccess,
    closeReportSuccess,
    openVerifyPopup,
    closeVerifyPopup,
  };
});
