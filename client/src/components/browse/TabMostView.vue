<script setup>
  import { getMostViewOfVideo } from '@/services/browse';
  import VideoListFilter from './VideoListFilter.vue';

  const sortByOptions = [
    { id: 1, name: 'Decreasing (High to Low)', value: 'viewCount', order: 'desc' },
    { id: 2, name: 'Ascending (Low to High)', value: 'viewCount', order: 'asc' },
  ];
</script>

<template>
  <VideoListFilter
    title="Most Viewed Videos"
    :fetchVideosFunction="getMostViewOfVideo"
    :sortByOptions="sortByOptions"
  />
</template>
