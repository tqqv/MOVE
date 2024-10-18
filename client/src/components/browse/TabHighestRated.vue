<script setup>
  import { getMostViewOfVideo } from '@/services/browse';
  import VideoListFilter from './VideoListFilter.vue';

  const sortByOptions = [
    { id: 5, name: 'Decreasing (High to Low)', value: 'ratings', order: 'desc' },
    { id: 6, name: 'Ascending (Low to High)', value: 'ratings', order: 'asc' },
  ];
</script>
<template>
  <VideoListFilter
    title="Highest Rated Videos"
    :fetchVideosFunction="getMostViewOfVideo"
    :sortByOptions="sortByOptions"
  />
</template>
