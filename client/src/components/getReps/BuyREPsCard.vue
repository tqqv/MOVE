<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Divider from 'primevue/divider';
  import { usePopupStore, useGetRepsStore, useContryStore } from '@/stores';
  import { getCardInfo } from '@/services/payment';
  import { useCardStore } from '@/stores/card.store';

  const emit = defineEmits(['toggleBuyREPs']);
  const props = defineProps({
    purchaseOptions: {
      type: Object,
    },
  });
  const getRepsStore = useGetRepsStore();
  const popupStore = usePopupStore();
  const cardStore = useCardStore();

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


  const toggleBuyREPs = async(purchaseOptions) => {
    await cardStore.fetchCard()
    console.log(cardStore.card);

    if(cardStore.card?.cardOwnerName){
      popupStore.isHaveCard = true
    } else {
      popupStore.isHaveCard = false
    }

    getRepsStore.setSelectedOption(purchaseOptions)


    emit('toggleBuyREPs', props.purchaseOptions);
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;
    emit('toggleGetREPsMenu');
  };
</script>
<template>
  <Divider class="pt-2" />

  <div class="flex items-center w-full justify-between">
    <div class="mr-4">
      <p class="font-bold text-lg text-black">{{ purchaseOptions.rep }} REP$</p>
      <p
        v-if="purchaseOptions.discount !== 1"
        :class="{
          'text-sm whitespace-nowrap text-[#666666]': !purchaseOptions,
          'text-sm text-red whitespace-nowrap': purchaseOptions,
        }"
      >
        {{ purchaseOptions.discount*100 }}% discount
        <span v-if="purchaseOptions.firstTime" class="text-red">for first time buyer!</span>
      </p>
    </div>
    <button @click="toggleBuyREPs(purchaseOptions)" class="btn w-[104px]">US${{ purchaseOptions.amount }}</button>
  </div>
</template>
