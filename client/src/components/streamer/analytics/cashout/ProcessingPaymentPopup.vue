<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';

  const props = defineProps({
    isProcessingPaymentVisible: Boolean,
    title: String,
  });
  const emit = defineEmits(['toogleProcessingPaymentVisible']);
  const toogleProcessingPaymentVisible = () => {
    emit('toogleProcessingPaymentVisible');
  };
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isProcessingPaymentVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @update:visible="toogleProcessingPaymentVisible"
      :style="{ width: '40rem' }"
    >
      <div class="text-black space-y-8">
        <div class="text-base">
          Your payment of <span class="font-bold">${{ money || 1223 }}</span> is being processed.
          Please allow 7 working days to receive your payment.
        </div>
        <div class="text-[#777777] text-xs">
          Note: The amount receive may vary due to the exchange rate & bank charges.
        </div>
        <div class="flex justify-center"><button class="btn w-[170px]">Close</button></div>
      </div>
    </Dialog>
  </div>
</template>
