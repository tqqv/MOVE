import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTabStore } from '@/stores';

export const usePopupStore = defineStore('popup', () => {
  const showGetREPsMenuOpen = ref(false);

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
  const showOpenBuyREPs = ref(false);
  const showLoadingPayment = ref(false);
  const isSelectPaymentMethod = ref(false);
  const showVerificationPopup = ref(false);

  const isCompletePurchaseVisible = ref(false);
  const showInstructionLive = ref(false);
  const showInstructionDonate = ref(false);
  const showSuspend = ref(false);
  const showBan = ref(false);
  const showAccept = ref(false);
  const showReject = ref(false);

  const isHaveCard = ref(false);
  const isOrderSuccessful = ref(true);
  const isCancelPayment = ref(false);
  const toggleVerificationPopup = () => {
    showVerificationPopup.value = !showVerificationPopup.value;
  };
  const toggleCompletePurchaseVisible = () => {
    isCompletePurchaseVisible.value = !isCompletePurchaseVisible.value;
  };
  const toggleGetREPsMenuOpen = () => {
    showGetREPsMenuOpen.value = !showGetREPsMenuOpen.value;
  };
  const toggleSelectPaymentMethod = () => {
    isSelectPaymentMethod.value = !isSelectPaymentMethod.value;
  };
  const toggleLoadingPayment = () => {
    showLoadingPayment.value = !showLoadingPayment.value;
  };
  const toggleBuyREPs = () => {
    showOpenBuyREPs.value = !showOpenBuyREPs.value;
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

  const openLoginPopup = () => {
    showLoginPopup.value = true;
    // tabStore.setActiveTab('0');
  };
  const openSignupPopup = () => {
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

  const openInstructionLive = () => {
    showInstructionLive.value = true;
  };

  const closeInstructionLive = () => {
    showInstructionLive.value = false;
  };

  const openInstructionDonate = () => {
    showInstructionDonate.value = true;
  };

  const closeInstructionDonate = () => {
    showInstructionDonate.value = false;
  };

  const openShowSuspend = () => {
    showSuspend.value = true;
  };

  const closeShowSuspend = () => {
    showSuspend.value = false;
  };

  const openShowBan = () => {
    showBan.value = true;
  };

  const closeShowBan = () => {
    showBan.value = false;
  };
  const openShowAccept = () => {
    showAccept.value = true;
  };

  const closeShowAccept = () => {
    showAccept.value = false;
  };
  const openShowReject = () => {
    showReject.value = true;
  };

  const closeShowReject = () => {
    showReject.value = false;
  };

  return {
    showOpenBuyREPs,
    showLoginPopup,
    showForgotPasswordPopup,
    showChangePassword,
    showChangePasswordSuccess,
    showVideoDetailPopup,
    showUploadVideoPopup,
    showConfirmDialog,
    showReportChannel,
    showReportSuccess,
    showSuspend,
    showBan,
    showAccept,
    showReject,
    openLoginPopup,
    openSignupPopup,
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
    toggleBuyREPs,
    showLoadingPayment,
    toggleLoadingPayment,
    isHaveCard,
    toggleGetREPsMenuOpen,
    showGetREPsMenuOpen,
    isOrderSuccessful,
    isCancelPayment,
    isSelectPaymentMethod,
    toggleSelectPaymentMethod,
    showVerificationPopup,
    toggleVerificationPopup,
    toggleCompletePurchaseVisible,
    isCompletePurchaseVisible,
    showInstructionLive,
    openInstructionLive,
    closeInstructionLive,
    showInstructionDonate,
    openInstructionDonate,
    closeInstructionDonate,
    openShowSuspend,
    closeShowSuspend,
    openShowBan,
    closeShowBan,
    openShowAccept,
    closeShowAccept,
    openShowReject,
    closeShowReject,
  };
});
