<script setup>
  import { ref, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  const data = {
    email: 'abc@gmail.com',
  };

  const code = ref('');
  const showVerificationPopup = ref(false);

  const buttonColor = computed(() => {
    return code.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !code.value.trim();
  });
</script>

<template>
  <div>
    <Button label="Show Verification Popup" @click="showVerificationPopup = true" />

    <Dialog
      v-model:visible="showVerificationPopup"
      header="Verify your email to keep account secure"
      class="w-[568px]"
      :draggable="false"
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
