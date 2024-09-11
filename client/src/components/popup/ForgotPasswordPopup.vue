<script setup>
  import { ref, computed, defineEmits } from 'vue';
  import Dialog from 'primevue/dialog';
  import { usePopupStore } from '@/stores';

  const popupStore = usePopupStore();
  const data = {
    email: 'abc@gmail.com',
  };
  const email = ref('');
  const isSubmitting = ref(false);
  const countdown = ref(0);
  const showMessage = ref(false);

  const buttonColor = computed(() => {
    return email.value.trim() && countdown.value === 0 ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !email.value.trim() || countdown.value > 0 || isSubmitting.value;
  });

  const sendResetLink = () => {
    isSubmitting.value = true;
    if (!email.value.trim()) return;

    showMessage.value = true;

    countdown.value = 60;
    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(interval);
        isSubmitting.value = false;
      }
    }, 1000);
  };
  const backToLoginPopup = () => {
    popupStore.closeForgotPasswordPopup();
    popupStore.openLoginPopup();
  };
</script>

<template>
  <Dialog header="Reset password" :draggable="false" class="w-[568px]">
    <div class="space-y-4">
      <div class="space-y-2">
        <label for="email" class="text_para" :class="{ 'text-gray-500': isSubmitting }">
          Enter email address for your account
        </label>
        <input v-model="email" type="email" class="input_custom" :disabled="isSubmitting" />
      </div>
      <div
        v-show="showMessage"
        class="border border-[#13D0B4] bg-[#E6FFFB] p-2 rounded-lg text-sm items-center text-center"
      >
        <span>
          We've sent an email to <span class="font-bold">{{ data.email }}</span
          >. Click the link in the email to reset your password.
        </span>
      </div>
      <div class="flex justify-center">
        <button :class="['p-2 ', buttonColor]" :disabled="isButtonDisabled" @click="sendResetLink">
          <span v-if="countdown > 0">{{ countdown }} seconds remaining</span>
          <span v-else>Send password reset link</span>
        </button>
      </div>
      <span @click="backToLoginPopup" class="text-link text-sm cursor-pointer flex justify-center">
        Back to login page
      </span>
    </div>
  </Dialog>
</template>
