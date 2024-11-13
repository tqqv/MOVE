<script setup>
  import { formatPercentage } from '@/utils';
  import { formatNumber } from '@/utils';
  const props = defineProps({
    title: String,
    value: [String, Number],
    percent: {
      type: Number,
      default: null,
    },
  });
</script>

<template>
  <div class="bg-white shadow-lg p-6 rounded-md text-black">
    <span class="text-sm xl:text-base font-bold whitespace-nowrap">{{ title }}</span>
    <div class="flex items-center space-x-2">
      <div class="text-[20px] xl:text-[32px] font-bold">{{ formatNumber(value) || 0 }}</div>
      <div v-if="percent !== null">({{ formatPercentage(percent) }}%)</div>
    </div>
  </div>
</template>
