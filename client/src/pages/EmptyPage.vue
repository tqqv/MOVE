<script setup>
  import NotFound from '@/components/icons/not-found.vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    isSmall: Boolean,
  });
</script>

<template>
  <div
    class="flex flex-col justify-center items-center w-full h-[382px]"
    :class="{ 'h-[280px] ': isSmall }"
  >
    <NotFound />
    <div class="flex items-center flex-col text-center gap-y-3">
      <h1 class="font-semibold text-2xl my-4 text-body">{{ title }}</h1>
      <p class="text-sm italic text-body">{{ subTitle }}</p>
    </div>
  </div>
</template>
