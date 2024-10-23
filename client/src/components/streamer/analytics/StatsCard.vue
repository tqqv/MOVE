<script setup>
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
    <span class="text-base font-bold whitespace-nowrap">{{ title }}</span>
    <div class="flex items-center space-x-2">
      <div class="text-[32px] font-bold">{{ value }}</div>
      <div v-if="percent !== null">({{ percent }}%)</div>
    </div>
  </div>
</template>
