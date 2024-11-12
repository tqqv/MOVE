<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { fetchCountries } from '@/services/address';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import Divider from 'primevue/divider';
  import { usePopupStore, useGetRepsStore } from '@/stores';

  const props = defineProps({
    title: String,
  });
  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();

  const emit = defineEmits(['toggleGetREPsMenu', 'toggleLoadPayment']);
  const chooseCard = ref(false);
  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');

  const toggleBuyREPs = () => {
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;

    getRepsStore.clearSelectedOption();
  };
  const toggleLoadPayment = () => {
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
          <div class="font-bold text-base">{{ getRepsStore.selectedOption.reps }} REP$</div>
          <div class="text-base">US${{ money }}</div>
        </div>
      </div>
      <div class="text-sm text-[#777777]">One-time charge on 20 Jul 2020.</div>
      <Divider />
      <div class="flex gap-x-6 justify-end">
        <div>Total</div>
        <div class="text-base font-bold">US${{ getRepsStore.selectedOption.money }}</div>
      </div>

      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Payment Details</div>
        <div class="space-y-12">
          <!-- CHOOSE CARD -->
          <div class="flex gap-x-4 pt-2 items-center">
            <div
              v-if="chooseCard"
              class="cursor-pointer border border-[#CCCCCC] rounded-md p-2 flex items-center opacity-50"
            >
              <VisaIcon />
            </div>
            <div v-else class="cursor-pointer border border-[#CCCCCC] rounded-md p-2">
              <MasterCardIcon />
            </div>
            <div class="flex justify-between items-center text-sm w-full">
              <div>
                Visa ending with <span class="font-bold">{{ endNumber || 1234 }}</span>
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
                <div class="text-base font-bold">US${{ getRepsStore.selectedOption.money }}</div>
              </div>
              <div><button @click="toggleLoadPayment" class="btn">Paynow</button></div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
