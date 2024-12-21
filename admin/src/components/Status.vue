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
        'bg-green': props.status === 'approved',
        'bg-red': props.status === 'rejected',
        'bg-yellow-dark': props.status === 'suspended',
        'bg-dark': props.status === 'banned',
      }"
    ></div>
    <span
      class="capitalize font-semibold"
      :class="{
        'text-blue': props.status === 'pending',
        'text-green': props.status === 'approved',
        'text-red': props.status === 'rejected',
        'text-yellow-dark': props.status === 'suspended',
        'text-dark': props.status === 'banned',
      }"
      >{{ props.status }}</span
    >
  </div>
</template>
