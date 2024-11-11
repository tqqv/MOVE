<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Divider from 'primevue/divider';
  import { usePopupStore, useGetRepsStore, useContryStore } from '@/stores';

  const emit = defineEmits(['toggleBuyREPs']);
  const props = defineProps({
    purchaseOptions: {
      type: Object,
    },
  });
  const getRepsStore = useGetRepsStore();
  const popupStore = usePopupStore();

  const toggleBuyREPs = () => {
    emit('toggleBuyREPs', props.purchaseOptions);
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;
    emit('toggleGetREPsMenu');
  };
</script>
<template>
  <Divider class="pt-2" />

  <div class="flex items-center w-full justify-between">
    <div class="mr-4">
      <p class="font-bold text-lg text-black">{{ purchaseOptions.reps }} REP$</p>
      <p
        v-if="purchaseOptions.discount"
        :class="{
          'text-sm whitespace-nowrap text-[#666666]': !purchaseOptions.firstTime,
          'text-sm text-red whitespace-nowrap': purchaseOptions.firstTime,
        }"
      >
        {{ purchaseOptions.discount }}% discount
        <span v-if="purchaseOptions.firstTime" class="text-red">for first time buyer!</span>
      </p>
    </div>
    <button @click="toggleBuyREPs" class="btn w-[104px]">US${{ purchaseOptions.money }}</button>
  </div>
</template>
