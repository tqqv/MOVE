<script setup>
  import VideoCard from './VideoCard.vue';

  const props = defineProps({
    videos: {
      type: Array,
      required: true,
    },

    page: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
    totalPages: {
      type: Number,
    },
  });
</script>
<template>
  <div class="w-full mt-4 py-4">
    <div
      class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8"
    >
      <VideoCard :videos="videos" />
    </div>
  </div>
</template>
