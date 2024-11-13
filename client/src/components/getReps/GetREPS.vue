<script setup>
  import BuyREPsCard from './BuyREPsCard.vue';
  import { ref } from 'vue';
  import { usePopupStore, useGetRepsStore, useContryStore } from '@/stores';

  const props = defineProps({
    reps: {
      type: Number,
    },
    isBackVisible: Boolean,
  });

  const emit = defineEmits(['toggleGetREPsMenu', 'toggleBuyREPs', 'toggleButtonGiftVisible']);
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
  const toggleBack = () => {
    emit('toggleButtonGiftVisible');
    emit('toggleGetREPsMenu');
  };
  const toggleGetREPsMenu = () => {
    emit('toggleGetREPsMenu');
  };
</script>
<template>
  <div class="shadow-lg rounded-lg w-[411px] p-5">
    <div>
      <div v-if="isBackVisible" class="relative pb-4">
        <div @click="toggleBack" class="flex items-center cursor-pointer text-primary">
          <i class="pi pi-angle-left text-2xl font-bold"></i>
          <span class="text-sm">Back</span>
        </div>
        <i
          @click="toggleGetREPsMenu"
          class="pi pi-times text-[20px] absolute right-[16px] top-[15%] cursor-pointer"
        />
        <h1 class="font-bold text-2xl">Buy REP$</h1>
      </div>

      <div v-else class="relative pb-4">
        <h1 class="font-bold text-2xl">Buy REP$</h1>
        <i
          @click="toggleGetREPsMenu"
          class="pi pi-times text-[20px] absolute right-[16px] top-[15%] cursor-pointer"
        />
      </div>
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
        @toggleGetREPsMenu="toggleGetREPsMenu"
      />
    </div>
  </div>
</template>
