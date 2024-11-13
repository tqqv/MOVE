<script setup>
  import VisaIcon from '../icons/visa.vue';
  import { ref, computed, onMounted } from 'vue';
  import RemoveCardPayment from './dialog/RemoveCardPayment.vue';
import { useCardStore } from '@/stores/card.store';

  const emit = defineEmits(['toggleOpenPaymentDetails']);

  const isRemoveVisible = ref(false);

  const cardStore = useCardStore()

  const toggleOpenRemove = async () => {
    isRemoveVisible.value = !isRemoveVisible.value;
  };

  const toggleCloseRemove = () => {
    isRemoveVisible.value = false;
  };

  const formattedNumber = computed(() => {
    return '**** **** **** ' + cardStore.card?.cardNumber;
  });
</script>

<template>
  <div class="bg-white shadow-lg p-6 rounded-md text-black w-[420px] space-y-8">
    <div>
      <div class="flex justify-between">
        <div><span class="text-xs">Card holder</span></div>
        <div class="flex gap-x-4">
         <span @click="toggleOpenRemove" class="text-[#E24848] cursor-pointer">Remove</span>
        </div>
      </div>
      <div class="text-[20px]">{{ cardStore.card.cardOwnerName }}</div>
    </div>
    <div class="space-y-2">
      <div class="text-xs">Card number</div>

      <div class="flex gap-x-4 items-center">
        <VisaIcon /><span class="items-center">{{ formattedNumber }}</span>
      </div>
    </div>
  </div>
  <RemoveCardPayment
    title="Remove card"
    :isRemoveVisible="isRemoveVisible"
    @closeRemove="toggleCloseRemove"
  />
</template>
