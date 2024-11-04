<script setup>
  import VisaIcon from '../icons/visa.vue';
  import { ref, computed } from 'vue';
  import RemoveCardPayment from './dialog/RemoveCardPayment.vue';
  import PaymentDetail from './dialog/PaymentDetail.vue';

  const isRemoveVisible = ref(false);
  const isPaymentDetailsVisible = ref(false);

  const toggleOpenRemove = async () => {
    isRemoveVisible.value = !isRemoveVisible.value;
  };
  const toggleOpenPaymentDetails = async () => {
    isPaymentDetailsVisible.value = !isPaymentDetailsVisible.value;
  };
  const toggleCloseRemove = () => {
    isRemoveVisible.value = false;
  };
  const toggleClosePaymentDetails = () => {
    isPaymentDetailsVisible.value = false;
  };

  const formattedNumber = computed(() => {
    return '**** **** **** ' + props.number.slice(-4);
  });
  const props = defineProps({
    username: String,
    number: Number,
  });
</script>

<template>
  <div class="bg-white shadow-lg p-6 rounded-md text-black w-[420px] space-y-8">
    <div>
      <div class="flex justify-between">
        <div><span class="text-xs">Card holder</span></div>
        <div class="flex gap-x-4">
          <span @click="toggleOpenPaymentDetails" class="text-primary cursor-pointer">Edit</span
          ><span @click="toggleOpenRemove" class="text-[#E24848] cursor-pointer">Remove</span>
        </div>
      </div>
      <div class="text-[20px]">{{ username }}</div>
    </div>
    <div class="space-y-2">
      <div class="text-xs">Card number</div>

      <div class="flex gap-x-4 items-center">
        <VisaIcon /><span class="items-center">{{ formattedNumber }}</span>
      </div>
    </div>
  </div>
  <RemoveCardPayment
    title="Remove card"
    :isRemoveVisible="isRemoveVisible"
    @closeRemove="toggleCloseRemove"
  />
  <PaymentDetail
    title="Payment details"
    :isPaymentDetailsVisible="isPaymentDetailsVisible"
    @closePayment="toggleClosePaymentDetails"
  />
</template>
