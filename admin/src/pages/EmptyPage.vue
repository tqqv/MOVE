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
  });
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full h-[402px]">
    <NotFound />
    <div class="flex items-center flex-col text-center gap-y-3">
      <h1 v-if="title" class="font-bold text-xl my-2 text-body">{{ title }}</h1>
      <p class="text-sm italic text-body">{{ subTitle }}</p>
    </div>
  </div>
</template>
