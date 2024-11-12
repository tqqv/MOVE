<script setup>
  import BuyREPsCard from './BuyREPsCard.vue';
  import { ref } from 'vue';
  import { usePopupStore, useGetRepsStore, useContryStore } from '@/stores';

  const props = defineProps({
    reps: {
      type: Number,
    },
  });

  const emit = defineEmits(['toogleGetREPsMenu', 'toggleBuyREPs']);
  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const countryStore = useContryStore();

  let hasFetchedCountries = false;
  const isOrderSuccessful = ref(false);

  const toggleBuyREPs = (selectedOption) => {
    getRepsStore.setSelectedOption(selectedOption);
    if (!hasFetchedCountries) {
      countryStore.fetchCountries();
      hasFetchedCountries = true;
    }
  };

  const toogleGetREPsMenu = () => {
    emit('toogleGetREPsMenu');
  };
</script>
<template>
  <div class="shadow-lg rounded-lg w-[411px] p-5">
    <div>
      <h1 class="font-bold text-2xl relative">
        Buy REP$
        <i
          @click="toogleGetREPsMenu"
          class="pi pi-times text-[20px] absolute right-[16px] top-[15%] cursor-pointer"
        ></i>
      </h1>
      <div class="space-y-2">
        <div class="text-base">
          You have <span class="font-bold">{{ totalReps || 0 }} REP$</span>
        </div>
        <div class="text-sm text-[#777777]">Prices are shown in USD</div>
      </div>
    </div>
    <div v-for="(option, index) in getRepsStore.purchaseOptions" :key="index" class="mt-4">
      <BuyREPsCard
        :purchaseOptions="option"
        @toggleBuyREPs="toggleBuyREPs"
        @toogleGetREPsMenu="toogleGetREPsMenu"
      />
    </div>
  </div>
</template>
