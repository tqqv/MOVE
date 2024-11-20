<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { fetchCountries } from '@/services/address';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import Divider from 'primevue/divider';
  import { usePopupStore, useGetRepsStore, useUserStore } from '@/stores';
  import { useCardStore } from '@/stores/card.store';
  import { checkout } from '@/services/payment';
  import { toast } from 'vue3-toastify';
  import { computed } from 'vue';

  const props = defineProps({
    title: String,
    isFirstTime: Boolean,
  });

  const currentDate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();

  const emit = defineEmits(['toggleGetREPsMenu', 'toggleLoadPayment', 'toggleOpenOrder']);
  const chooseCard = ref(false);
  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');

  const toggleBuyREPs = () => {
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;

    getRepsStore.clearSelectedOption();
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleCheckout = async (paymentMethodId) => {
    try {
      // Thiết lập data cho checkout
      const dataCheckout = {
        paymentMethodId: paymentMethodId,
        repPackageId: getRepsStore.selectedOption.id,
      };

      // Bắt đầu quá trình thanh toán, hiển thị popup loading
      popupStore.showLoadingPayment = true;
      popupStore.showOpenBuyREPs = false; // Ẩn popup "Order Success"
      await sleep(3000);
      //cancel
      if (popupStore.isCancelPayment) return;
      // Thực hiện checkout
      const res = await checkout(dataCheckout);

      // Kiểm tra kết quả trả về từ API
      if (res && res.status === 200) {
        userStore.user.REPs += getRepsStore.selectedOption.rep;
        // console.log('Payment successful.');
        emit('toggleOpenOrder'); // Hiện popup "Order Success"
        popupStore.isOrderSuccessful = true;
      } else if (res.status === 201) {
        // console.log('Payment has been initiated, please wait.');
        emit('toggleOpenOrder'); // Hiện popup "Order Pending"
      } else {
        // console.log('Payment failed!');
        emit('toggleOpenOrder'); // Hiện popup "Payment Failed"

        popupStore.isOrderSuccessful = false;
      }
    } catch (error) {
      console.error('Error during checkout:', error.message);
      // Nếu có lỗi, hiển thị popup lỗi
      emit('toggleOpenOrder');
    } finally {
      popupStore.showLoadingPayment = false;
    }
  };

  const toggleLoadPayment = async () => {
    await handleCheckout(cardStore.card.paymentMethodId);
  };
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="popupStore.showOpenBuyREPs"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toggleBuyREPs"
      :style="{ width: '40rem' }"
    >
      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Order Summary</div>
        <div class="flex justify-between">
          <div class="font-bold text-base">{{ getRepsStore.selectedOption.rep }} REP$</div>
          <div class="text-base">US${{ getRepsStore.selectedOption.amount }}</div>
        </div>
      </div>
      <div v-if="isFirstTime" class="text-sm text-[#777777]">
        One-time charge on {{ currentDate }}.
      </div>
      <Divider />
      <div class="flex gap-x-6 justify-end">
        <div>Total</div>
        <div class="text-base font-bold">US${{ getRepsStore.selectedOption.amount }}</div>
      </div>

      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Payment Details</div>
        <div class="space-y-12">
          <!-- CHOOSE CARD -->
          <div class="flex gap-x-4 py-2 items-center">
            <div
              v-if="cardStore.card.cardType === 'visa'"
              class="cursor-pointer border border-[#CCCCCC] rounded-md p-2 flex items-center"
            >
              <VisaIcon />
            </div>
            <div v-else class="cursor-pointer border border-[#CCCCCC] rounded-md p-2">
              <MasterCardIcon />
            </div>
            <div class="flex justify-between items-center text-sm w-full">
              <div>
                Visa ending with <span class="font-bold">{{ cardStore.card.cardNumber }}</span>
              </div>
            </div>
          </div>
          <span class="text-sm text-primary cursor-pointer">Change payment method</span>

          <!-- submit -->
          <div class="space-y-4">
            <div class="text-xs">
              <span class="text-[#777777]">
                By submitting payment information you acknowledge that you have read, understood and
                agree to be bound by MOVE’s
              </span>
              <span class="text-primary"> End User License Agreement, Privacy Policy</span>
              <span class="text-[#777777]"> and</span>
              <span class="text-primary"> Refund Policy</span>.
            </div>
            <div class="flex gap-x-6 justify-center items-center">
              <div class="flex gap-x-6 justify-end">
                <div>Total</div>
                <div class="text-base font-bold">US${{ getRepsStore.selectedOption.amount }}</div>
              </div>
              <div><button @click="toggleLoadPayment" class="btn">Paynow</button></div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
