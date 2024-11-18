<script setup>
  import { ref, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { usePopupStore } from '@/stores';

  const data = {
    email: 'abc@gmail.com',
  };
  const popupStore = usePopupStore();

  const code = ref('');

  const buttonColor = computed(() => {
    return code.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !code.value.trim();
  });
</script>

<template>
  <div>
    <Dialog
      :visible="popupStore.showVerificationPopup"
      header="Verify your email to keep account secure"
      :style="{ width: '40rem' }"
      :modal="true"
      :draggable="false"
      @update:visible="popupStore.toggleVerificationPopup()"
    >
      <div class="space-y-4">
        <span class="text_para">
          We sent a 6-digit code to <span class="font-bold">{{ data.email }}</span
          >. Enter the code below to confirm your account. You may also tap on the link in the email
          we sent you.
        </span>

        <form @submit.prevent="submitVerificationForm" class="w-full space-y-4">
          <div class="space-y-2">
            <div class="relative">
              <label for="code" class="text_para">
                Verification Code (<span class="text-primary cursor-pointer">Resend code</span>)
              </label>
              <input v-model="code" type="text" class="input_custom" required />
            </div>
          </div>
          <div class="flex justify-center">
            <button type="submit" :class="['w-1/2 p-2', buttonColor]" :disabled="isButtonDisabled">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
