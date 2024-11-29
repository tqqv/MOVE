<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Divider from 'primevue/divider';
  import { usePopupStore, useGetRepsStore, useContryStore, useCardStore } from '@/stores';
  import { getCardInfo, getPaymentHistory } from '@/services/payment';
  import { formatPercentage } from '@/utils';

  const emit = defineEmits(['toggleBuyREPs', 'selectOption']);
  const props = defineProps({
    purchaseOptions: {
      type: Object,
    },
    isFirstTime: Boolean,
  });
  const getRepsStore = useGetRepsStore();
  const popupStore = usePopupStore();
  const cardStore = useCardStore();
  const countryStore = useContryStore();

  let hasFetchedCountries = false;

  // console.log(getRepsStore.selectedOption);

  // const isOpenBuyREPs = ref(false);
  // const isOpenOrder = ref(true);
  // const isOrderSuccessful = ref(false);

  // const isHaveInfo = ref(true);
  // const isLoadPayment = ref(false);
  // const toggleOrder = () => {
  //   isOpenOrder.value = !isOpenOrder.value;
  // };
  // const toggleLoadPayment = () => {
  //   isLoadPayment.value = !isLoadPayment.value;
  //   isOpenBuyREPs.value = false;
  // };

  const toggleBuyREPs = async () => {
    console.log(props.purchaseOptions);

    emit('selectOption', props.purchaseOptions);

    popupStore.toggleCompletePurchaseVisible();
    if (!hasFetchedCountries) {
      countryStore.fetchCountries();
      hasFetchedCountries = true;
    }
    if (!cardStore.card || cardStore.card.length === 0) {
      await cardStore.fetchCard();
    }
    getRepsStore.setSelectedOption(getRepsStore.selectedOption);
    // close buy reps
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;
    emit('toggleGetREPsMenu');
    // if (cardStore.card?.cardOwnerName) {
    //   popupStore.isHaveCard = true;
    // } else {
    //   popupStore.isHaveCard = false;
    // }

    // getRepsStore.setSelectedOption(purchaseOptions);

    // emit('toggleBuyREPs', props.purchaseOptions);
    // popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;
    // emit('toggleGetREPsMenu');
  };
</script>
<template>
  <div
    class="bg-white rounded-lg p-4 flex items-center space-x-4 border border-gray-light hover:shadow-lg transition-all duration-300"
  >
    <div class="flex-grow">
      <div class="flex items-baseline space-x-2">
        <p class="font-bold text-xl text-black">{{ purchaseOptions.rep }} REP$</p>
        <p v-if="purchaseOptions.discount !== 0" class="text-sm text-red px-1 py-1 rounded-full">
          {{ formatPercentage(purchaseOptions.discount * 100) }}% OFF
        </p>
      </div>
      <p class="text-gray-500 line-through text-sm mt-1" v-if="purchaseOptions.discount !== 0">
        US$ {{ purchaseOptions.amount }}
      </p>
    </div>
    <button
      @click="toggleBuyREPs(purchaseOptions)"
      class="w-1/3 bg-primary text-white px-4 py-2 rounded-lg text-base font-bold hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap"
    >
      US$
      {{
        (purchaseOptions.amount - purchaseOptions.amount * purchaseOptions.discount)
          .toFixed(2)
          .replace(/\.00$/, '')
      }}
    </button>
  </div>
</template>
