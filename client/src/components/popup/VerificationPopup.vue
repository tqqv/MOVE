<script setup>
  import { ref, computed, onMounted } from 'vue';
  import Dialog from 'primevue/dialog';
  import { usePopupStore, useUserStore } from '@/stores';

  const popupStore = usePopupStore();
  const userStore = useUserStore();
  const code = ref('');
  const buttonColor = computed(() => {
    return code.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !code.value.trim();
  });
  const user = computed(() => userStore.getUser());
</script>

<template>
  <div>
    <Dialog
      v-model:visible="popupStore.showVerifyPopup"
      header="Verify your email to keep account secure"
      class="w-[568px]"
      :draggable="false"
    >
      <div class="space-y-4">
        <span class="text_para">
          We sent a 6-digit code to <span class="font-bold">{{ user.email }}</span
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
