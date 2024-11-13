<script setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  const data = {
    email: 'abc@gmail.com',
  };
  const showVerificationFailedPopup = ref(false);
</script>

<template>
  <div>
    <Button label="Show Verification failed" @click="showVerificationFailedPopup = true" />

    <Dialog
      v-model:visible="showVerificationFailedPopup"
      header="Verification failed"
      class="w-[568px]"
      :draggable="false"
      dismissableMask="true"
    >
      <div class="space-y-4">
        <span class="text_para">
          Your account verification has expired. Please verify your account again to enjoy full
          access on MOVE.
        </span>

        <span class="text_para">
          <a class="text-primary underline" href="#">Resend verification email</a> to
          <span class="font-bold">{{ data.email }}</span>
        </span>
        <div class="flex justify-center">
          <button class="btn w-1/2 p-2" type="submit">Login</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
