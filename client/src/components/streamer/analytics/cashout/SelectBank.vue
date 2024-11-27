<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import PaymentIcon from '@/components/icons/payment.vue';
  import { usePopupStore, useGetRepsStore, useContryStore, useCardStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import CheckboxCustom from '@/components/CheckboxCustom.vue';

  const props = defineProps({
    title: String,
    isSelectBankVisible: Boolean,
  });
  const emit = defineEmits(['toogleSelectBankVisible']);
  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const countryStore = useContryStore();
  const toogleSelectBankVisible = () => {
    emit('toogleSelectBankVisible', 'toogleBankDetailsVisible');
  };
  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');

  const toggleSelectPayment = async () => {
    if (selectedPayment.value === 'Credit card') {
      emit('toogleSelectBankVisible');
      emit('toogleBankDetailsVisible');
    } else {
      toast.info('We are developing this payment method');
    }
  };
  const paymentMethods = [
    { label: 'Credit card', value: 'credit-card' },
    { label: 'Online banking', value: 'online-banking' },
  ];
  const selectedPayment = ref('');
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :header="props.title"
      :visible="isSelectBankVisible"
      :modal="true"
      :draggable="false"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toogleSelectBankVisible()"
      :style="{ width: '40rem' }"
    >
      <div class="flex gap-x-12 p-8 text-base">
        <CheckboxCustom
          v-for="method in paymentMethods"
          :key="method.value"
          :label="method.label"
          groupName="payment-method"
          :checked="selectedPayment === method.label"
          @update:modelValue="(val) => (selectedPayment = val)"
        />
      </div>
      <div class="flex justify-center cursor-pointer">
        <button @click="toggleSelectPayment" class="btn w-1/3">Next</button>
      </div>
    </Dialog>
  </div>
</template>
