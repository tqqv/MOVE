<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import Dialog from 'primevue/dialog';
  import { usePopupStore } from '@/stores';
  import { postSendMail } from '@/services/auth';
  import { toast } from 'vue3-toastify';

  const popupStore = usePopupStore();
  const props = defineProps({
    email: String,
  });
  const code = ref('');
  const countdown = ref(0);
  const timer = ref(null);

  const buttonColor = computed(() => {
    return code.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !code.value.trim();
  });

  const sendMail = async () => {
    try {
      const response = await postSendMail({ email: props.email });
      // if (response.data.data.success) {
      //   toast.success(response.data.data.message);
      // }
      console.log(response);

      startCountdown();
    } catch (error) {
      console.error(error?.message || 'Login failed');
    }
  };

  const startCountdown = () => {
    countdown.value = 60;
    clearInterval(timer.value);
    timer.value = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearInterval(timer.value);
      }
    }, 1000);
  };

  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });
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
          We sent a 6-digit code to <span class="font-bold">{{ email }}</span
          >. Enter the code below to confirm your account. You may also tap on the link in the email
          we sent you.
        </span>

        <form @submit.prevent="submitVerificationForm" class="w-full space-y-4">
          <div class="space-y-2">
            <div class="relative">
              <label for="code" class="text_para">
                Verification Code
                <span v-if="countdown === 0" @click="sendMail" class="text-primary cursor-pointer">
                  (Resend code)
                </span>
                <span class="text-primary" v-if="countdown > 0">({{ countdown }} seconds)</span>
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
