<script setup>
  import { ref, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  const email = ref('');
  const showVerifyEmailFacebookPopup = ref(false);

  const buttonColor = computed(() => {
    return email.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !email.value.trim();
  });
</script>

<template>
  <div>
    <Button label="Show Facebook Popup" @click="showVerifyEmailFacebookPopup = true" />

    <Dialog
      v-model:visible="showVerifyEmailFacebookPopup"
      header="Almost there"
      :draggable="false"
      class="w-[568px]"
      :dismissableMask="true"
    >
      <div class="space-y-4">
        <span class="text_para">
          Your email was not found on your Facebook Account, your email is required to receive
          billing information & announcement from us. We will send you an OTP to your email to
          verify your account.
        </span>

        <form @submit.prevent="submitVerificationForm" class="w-full space-y-4">
          <div class="space-y-2">
            <div class="relative">
              <label for="code" class="text_para">Enter Email </label>
              <input v-model="email" type="email" class="input_custom" required />
            </div>
          </div>

          <div class="flex justify-center">
            <button type="submit" :class="['w-1/2 p-2', buttonColor]" :disabled="isButtonDisabled">
              Continue
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
