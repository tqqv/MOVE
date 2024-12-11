<script setup>
  const props = defineProps({
    status: String,
  });
</script>

<template>
  <div class="flex items-center gap-x-2">
    <div
      class="size-2 mt-0.5 bg-blue rounded-full flicker"
      :class="{
        'bg-blue': props.status === 'pending',
        'bg-green': props.status === 'accepted',
        'bg-red': props.status === 'rejected',
      }"
    ></div>
    <span
      class="capitalize font-semibold"
      :class="{
        'text-blue': props.status === 'pending',
        'text-green': props.status === 'accepted',
        'text-red': props.status === 'rejected',
      }"
      >{{ props.status }}</span
    >
  </div>
</template>


