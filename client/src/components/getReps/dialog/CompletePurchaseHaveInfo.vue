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

  const props = defineProps({
    title: String,
  });
  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();


  const emit = defineEmits(['toggleGetREPsMenu', 'toggleLoadPayment']);
  const chooseCard = ref(false);
  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');

  const toggleBuyREPs = () => {
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;

    getRepsStore.clearSelectedOption();
  };

  const handleCheckout = async () => {
    const dataCheckout = {
      paymentMethodId: cardStore.card.paymentMethodId,
      repPackageId: getRepsStore.selectedOption.id,
    }
    const res = await checkout(dataCheckout)
    if (res && res.status === 200) {
      userStore.user.REPs += getRepsStore.selectedOption.rep;
      // toast.success('Payment successful.') // Payment has been initiated, please wait
    } else if(res.status === 201) {
      // toast.info('Payment has been initiated, please wait.')
      console.log('Payment has been initiated, please wait.');
    } else {
      // toast.error("Payment failed!")
      console.log('Payment failed!');
    }

  }

  const toggleLoadPayment = async() => {
    await handleCheckout()
    popupStore.showLoadingPayment = !popupStore.showLoadingPayment;
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;
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
      <div class="text-sm text-[#777777]">One-time charge on 20 Jul 2020.</div>
      <Divider />
      <div class="flex gap-x-6 justify-end">
        <div>Total</div>
        <div class="text-base font-bold">US${{ getRepsStore.selectedOption.amount }}</div>
      </div>

      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Payment Details</div>
        <div class="space-y-12">
          <!-- CHOOSE CARD -->
          <div class="flex gap-x-4 pt-2 items-center">
            <div
              v-if="cardStore.card.cardType === 'visa'"
              class="cursor-pointer border border-[#CCCCCC] rounded-md p-2 flex items-center opacity-50"
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
              <div class="text-primary cursor-pointer">Change</div>
            </div>
          </div>
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
