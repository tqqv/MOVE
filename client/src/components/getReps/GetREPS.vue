<script setup>
  import BuyREPsCard from './BuyREPsCard.vue';
  import { ref } from 'vue';
  import { useUserStore, useGetRepsStore, useContryStore, usePopupStore } from '@/stores';
  import Skeleton from 'primevue/skeleton';
  import Divider from 'primevue/divider';
  import { formatNumber } from '@/utils';

  const props = defineProps({
    reps: {
      type: Number,
    },
    isBackVisible: Boolean,
    isFirstTime: Boolean,
  });

  const emit = defineEmits(['toggleGetREPsMenu', 'toggleBuyREPs', 'toggleButtonGiftVisible']);
  const userStore = useUserStore();
  const getRepsStore = useGetRepsStore();
  const countryStore = useContryStore();
  const popupStore = usePopupStore();

  let hasFetchedCountries = false;

  const toggleBuyREPs = (selectedOption) => {
    getRepsStore.setSelectedOption(selectedOption);
    if (!hasFetchedCountries) {
      countryStore.fetchCountries();
      hasFetchedCountries = true;
    }
  };
  const toggleBack = () => {
    emit('toggleGetREPsMenu'); // close buy reps
    emit('toggleButtonGiftVisible');

    // emit('toggleBuyREPs');
  };
  const toggleGetREPsMenu = () => {
    emit('toggleGetREPsMenu');
  };
  const selectOption = (option) => {
    getRepsStore.setSelectedOption(option);
    emit('toggleGetREPsMenu');
  };
</script>
<template>
  <div class="shadow-lg rounded-lg w-[411px] p-5">
    <div>
      <div v-if="isBackVisible" class="relative pb-2">
        <div @click="toggleBack" class="flex items-center cursor-pointer text-primary">
          <i class="pi pi-angle-left text-2xl font-bold"></i>
          <span class="text-sm">Back</span>
        </div>
        <i
          @click="toggleGetREPsMenu"
          class="pi pi-times text-[20px] absolute right-[16px] top-[15%] cursor-pointer"
        />
        <h1 class="font-bold text-xl">Buy REP$</h1>
      </div>

      <div v-else class="relative pb-4">
        <h1 class="font-bold text_subTitle">Buy REP$</h1>
        <i
          @click="toggleGetREPsMenu"
          class="pi pi-times text-[20px] absolute right-[16px] top-[15%] cursor-pointer"
        />
      </div>
      <div class="space-y-2">
        <div class="text-base">
          You have <span class="font-bold">{{ formatNumber(userStore.user.REPs) || 0 }} REPs</span>
        </div>
        <div class="text-sm text-[#777777]">Prices are shown in SGD</div>
      </div>
    </div>

    <div
      v-if="getRepsStore.isLoadingRepPackages"
      v-for="n in getRepsStore.purchaseOptions.length"
      :key="n"
      class="mt-4"
    >
      <div
        class="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 border border-gray-light hover:shadow-lg transition-all duration-300"
      >
        <div class="flex gap-16 items-center">
          <!-- Skeleton cho hình ảnh -->
          <!-- Skeleton cho thông tin -->
          <div class="flex-1">
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
          </div>
          <Skeleton width="7rem" height="2.5rem"></Skeleton>
        </div>
      </div>
    </div>
    <div v-else class="space-y-2 overflow-y-auto" style="max-height: 300px">
      <div class="mt-4 pr-2" v-for="(option, index) in getRepsStore.purchaseOptions" :key="index">
        <BuyREPsCard
          :purchaseOptions="option"
          @toggleBuyREPs="toggleBuyREPs"
          @toggleGetREPsMenu="toggleGetREPsMenu"
          :isFirstTime="isFirstTime"
          :index="index"
          @selectOption="selectOption(option)"
        />
      </div>
    </div>
  </div>
</template>
