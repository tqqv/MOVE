<script setup>
  const props = defineProps({
    title: String,
    value: [String, Number],
  });
</script>

<template>
  <div class="bg-white shadow-lg p-6 rounded-md">
    <span class="text-base font-bold">{{ title }}</span>
    <div class="text-[32px] font-bold">{{ value }}</div>
  </div>
</template>
