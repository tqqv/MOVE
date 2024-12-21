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
    isMid: Boolean,
  });
</script>

<template>
  <div
    class="flex flex-col justify-center items-center w-full"
    :class="{ 'h-[100px]': isSmall, 'h-[270px]': isMid, 'h-[382px]': !isSmall && !isMid }"
  >
    <NotFound />
    <div class="flex items-center flex-col text-center gap-y-3">
      <h1 class="font-semibold text-2xl my-4 text-body">{{ title }}</h1>
      <p class="text-sm italic text-body">{{ subTitle }}</p>
    </div>
  </div>
</template>
