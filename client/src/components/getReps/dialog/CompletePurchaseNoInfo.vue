<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';

  import Divider from 'primevue/divider';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';
  import { usePopupStore, useGetRepsStore } from '@/stores';

  const props = defineProps({
    title: String,
  });
  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();

  const isCheckMark = ref(false);

  const toggleLoadPayment = () => {
    popupStore.showLoadingPayment = !popupStore.showLoadingPayment;
    popupStore.showOpenBuyREPs = false;
  };
  const toggleBuyREPs = () => {
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;

    getRepsStore.clearSelectedOption();
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
      dismissableMask="true"
    >
      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Order Summary</div>
        <div class="flex justify-between">
          <div class="font-bold text-base">{{ getRepsStore.selectedOption.reps }} REP$</div>
          <div class="text-base">US${{ getRepsStore.selectedOption.money }}</div>
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

        <FormCardPayment />
        <div class="text-xs">
          <span class="text-[#777777]">
            By submitting payment information you acknowledge that you have read, understood and
            agree to be bound by MOVE’s
          </span>
          <span class="text-primary"> End User License Agreement, Privacy Policy</span>
          <span class="text-[#777777]"> and</span>
          <span class="text-primary"> Refund Policy</span>.
        </div>
        <CheckMarkCustom
          label="Save my payment details for faster checkout in the future."
          :checked="isCheckMark"
          groupName="checkMark"
        />
        <div class="flex justify-center mt-4">
          <button @click="toggleLoadPayment" class="btn w-1/3">Submit</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
