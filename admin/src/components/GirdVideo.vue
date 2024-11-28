<script setup>
  import VideoCard from './VideoCard.vue';
  import Skeleton from 'primevue/skeleton';

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
    loading: {
      type: Boolean,
      required: true,
    },
  });
</script>
<template>
  <div class="w-full mt-4 py-4">
    <div
      v-if="loading"
      class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 h-[230px] gap-x-5"
    >
      <div v-for="n in 4" :key="n" class="flex flex-col gap-y-3">
        <Skeleton height="200px" />
        <div class="flex mt-4">
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
          <div>
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
            <Skeleton height=".5rem"></Skeleton>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8"
    >
      <VideoCard :videos="videos" />
    </div>
  </div>
</template>
