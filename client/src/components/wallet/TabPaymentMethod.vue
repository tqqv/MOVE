<script setup>
  import { onMounted, ref } from 'vue';
  import CardPayment from './CardPayment.vue';
  import PaymentDetail from '@components/wallet/dialog/PaymentDetail.vue';
  import { useContryStore } from '@/stores';
  import { getCardInfo } from '@/services/payment';
  import { useCardStore } from '@/stores/card.store';

  const countryStore = useContryStore();
  const cardStore = useCardStore();
  const isDisplay = ref(false);
  let hasFetchedCountries = false;

  const isPaymentDetailsVisible = ref(false);
  const toggleOpenPaymentDetails = async () => {
    isPaymentDetailsVisible.value = !isPaymentDetailsVisible.value;
    if (!hasFetchedCountries) {
      countryStore.fetchCountries();
      hasFetchedCountries = true;
    }
  };

  onMounted(async () => {
    cardStore.fetchCard();
  });
</script>
<template>
  <div class="space-y-2">
    <span class="text-base font-bold">Your payment method</span>

    <!-- Card -->
    <CardPayment
      v-if="cardStore.card?.cardOwnerName"
      @toggleOpenPaymentDetails="toggleOpenPaymentDetails"
    />

    <!-- No card -->
    <div v-else class="flex items-center justify-center pt-[10%]">
      <div class="space-y-6 text-center">
        <div class="justify-center">
          <div class="text-base font-bold">No payment method setup</div>
          <div class="text-base italic">You do not have any saved payment information.</div>
        </div>
        <div>
          <button @click="toggleOpenPaymentDetails" class="btn">Setup payment method</button>
        </div>
      </div>
    </div>
  </div>
  <PaymentDetail
    title="Payment details"
    :isPaymentDetailsVisible="isPaymentDetailsVisible"
    @closePayment="toggleOpenPaymentDetails"
  />
</template>
