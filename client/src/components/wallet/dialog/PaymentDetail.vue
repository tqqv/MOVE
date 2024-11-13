<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { fetchCountries } from '@/services/address';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';

  const props = defineProps({
    isPaymentDetailsVisible: Boolean,
    title: String,
  });
  const countries = ref([]);

  const emit = defineEmits(['closePayment']);

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');
  const toggleClosePayment = () => {
    emit('closePayment');
  };

  const loadCountries = async () => {
    try {
      countries.value = await fetchCountries();
    } catch (error) {
      console.error(error);
    }
  };

  watch(
    () => props.isPaymentDetailsVisible,
    (newVal) => {
      if (newVal) lockScroll();
      else unlockScroll();
    },
  );

  onMounted(() => {
    loadCountries();
  });
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isPaymentDetailsVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toggleClosePayment"
      :style="{ width: '40rem' }"
      dismissableMask="true"
    >
      <div class="space-y-4">
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
        <div class="flex justify-center mt-4">
          <button class="btn w-1/3">Submit</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
