<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import Checkbox from '@components/CheckboxReport.vue';
  import BankDetail from './BankDetail.vue';

  const props = defineProps({
    isReceivePaymentVisible: Boolean,
    title: String,
  });
  const emit = defineEmits(['toogleReceivePaymentVisible']);
  const toogleReceivePaymentVisible = () => {
    emit('toogleReceivePaymentVisible');
  };
  const groupName = 'paymentMethods';
  const isBankDetailsVisible = ref(false);
  const selectedPayments = ref([]);
  const toogleBankDetailsVisible = () => {
    isBankDetailsVisible.value = !isBankDetailsVisible.value;
  };

  const paymentType = ref([
    { id: 1, description: 'International bank' },
    { id: 2, description: 'Paypal' },
  ]);

  const updateSelectedPayment = (payment) => {
    selectedPayments.value = payment;

    console.log('Selected payment type:', selectedPayments.value);
  };

  const onNextClick = () => {
    if (selectedPayments.value.description === 'International bank') {
      isBankDetailsVisible.value = true;
      emit('toogleReceivePaymentVisible');
    } else {
      isBankDetailsVisible.value = false;
    }
  };
</script>

<template>
  <Dialog
    :visible="isReceivePaymentVisible"
    :modal="true"
    :draggable="false"
    :header="props.title"
    @update:visible="toogleReceivePaymentVisible"
    :style="{ width: '40rem' }"
    dismissableMask="true"
  >
    <div class="text-black space-y-8">
      <div v-for="payment in paymentType" :key="payment.id" class="flex gap-4 items-center mt-3">
        <Checkbox
          :label="payment.description"
          :value="payment.id"
          :groupName="groupName"
          @change="(event) => updateSelectedPayment(payment)"
        />
      </div>
      <div class="flex justify-center">
        <button @click="onNextClick" class="btn w-[170px]">Next</button>
      </div>
    </div>
  </Dialog>
  <BankDetail
    :isBankDetailsVisible="isBankDetailsVisible"
    @toogleBankDetailsVisible="toogleBankDetailsVisible"
    @toogleReceivePaymentVisible="toogleReceivePaymentVisible"
    title="Enter bank details"
  />
</template>
