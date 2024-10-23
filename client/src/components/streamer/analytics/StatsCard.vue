<script setup>
  const props = defineProps({
    title: String,
    value: [String, Number],
    percent: Number,
  });
</script>

<template>
  <div class="bg-white shadow-lg p-6 rounded-md">
    <span class="text-base font-bold whitespace-nowrap">{{ title }}</span>
    <div class="flex items-center space-x-2">
      <div class="text-[32px] font-bold">{{ value }}</div>
      <div>({{ percent }}%)</div>
    </div>
  </div>
</template>
