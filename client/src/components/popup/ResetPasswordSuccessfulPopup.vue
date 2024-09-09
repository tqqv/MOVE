<script setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  const showResetSuccessfulPopup = ref(false);
</script>

<template>
  <div>
    <Button label="Show Reset Successful" @click="showResetSuccessfulPopup = true" />

    <Dialog
      v-model:visible="showResetSuccessfulPopup"
      header="Password reset successful"
      class="w-[424px]"
      :draggable="false"
    >
      <div class="space-y-4">
        <span class="text_para">
          Good news! You are just a few steps away from logging into MOVE. Click the button below to
          login.
        </span>
        <div class="flex justify-center">
          <button class="btn w-1/2 p-2" type="submit">Login</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
