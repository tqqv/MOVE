<script setup>
  import { getMostViewOfVideo } from '@/services/browse';
  import VideoListFilter from './VideoListFilter.vue';

  const sortByOptions = [
    { id: 1, name: 'Decreasing (High to Low)', sortBy: 'viewCount', order: 'desc' },
    { id: 2, name: 'Ascending (Low to High)', sortBy: 'viewCount', order: 'asc' },
  ];
</script>

<template>
  <VideoListFilter
    title="Most Viewed Videos"
    :fetchVideosFunction="getMostViewOfVideo"
    :sortByOptions="sortByOptions"
  />
</template>
