<script setup>
  import { ref, computed, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { usePopupStore, useUserStore } from '@/stores';
  import { createWithdrawInfor, verifyOtp, sendMail } from '@/services/cashout';
  import { toast } from 'vue3-toastify';
  import { useWithdrawInfor } from '@/stores/withdrawInfor.store';
  import smallLoading from '@/components/icons/smallLoading.vue';

  const props = defineProps({
    tokenBank: String,
    title: String,
  });
  const popupStore = usePopupStore();
  const userStore = useUserStore();
  const withdrawInforStore = useWithdrawInfor();

  const otp = ref('');
  const isLoading = ref(false);
  const countdown = ref(0);
  const buttonColor = computed(() => {
    return otp.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !otp.value.trim();
  });
  const startCountdown = () => {
    countdown.value = 60;
    const interval = setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  const resendMail = async () => {
    if (countdown.value > 0) return;
    try {
      const res = await sendMail();
      if (res.status === 200) {
        toast.success('Code resent successfully.');
        startCountdown();
      } else {
        toast.error(res.message || 'Failed to resend code.');
      }
    } catch (error) {
      toast.error('Error sending code. Please try again later.');
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    if (isLoading.value) return;
    try {
      const response = await verifyOtp(otp.value);
      if (response.status === 200) {
        isLoading.value = true;

        const res = await createWithdrawInfor(props.tokenBank);
        if (res.status === 200) {
          toast.success('Create successful withdraw information');
          await withdrawInforStore.fetchWithdrawInfor();
          popupStore.toggleVerificationPopup();
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      isLoading.value = false;
    }
  };
  watch(
    () => popupStore.showVerificationPopup,
    (newVal) => {
      if (newVal) {
        startCountdown();
      }
    },
  );
</script>

<template>
  <div>
    <Dialog
      :visible="popupStore.showVerificationPopup"
      :header="title"
      :style="{ width: '40rem' }"
      :modal="true"
      :draggable="false"
      @update:visible="popupStore.toggleVerificationPopup()"
    >
      <div class="space-y-4">
        <span class="text_para">
          We sent a 6-digit code to <span class="font-bold">{{ userStore.user?.email }}</span
          >. Enter the code below to confirm your account
        </span>

        <form @submit.prevent="handleSubmit" class="w-full space-y-4">
          <div class="space-y-2">
            <div class="relative">
              <label for="otp" class="text_para">
                Verification Code (<span
                  @click="resendMail"
                  class="text-primary"
                  :class="{
                    'cursor-pointer': countdown === 0,
                    '': countdown > 0,
                  }"
                  :disabled="countdown > 0"
                >
                  Resend code {{ countdown > 0 ? `(${countdown}s)` : '' }} </span
                >)
              </label>
              <input v-model="otp" type="text" class="input_custom" required />
            </div>
          </div>
          <div class="flex justify-center">
            <button
              type="submit"
              :class="['w-1/2 p-2', buttonColor]"
              :disabled="isButtonDisabled || isLoading"
            >
              <smallLoading v-if="isLoading" fill="white" fill_second="#13d0b4" />
              <span v-else>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>
