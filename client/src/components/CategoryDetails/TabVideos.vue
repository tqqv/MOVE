<script setup>
  import { getMostViewOfVideo } from '@/services/browse';
  import VideoListFilter from './VideoListFilter.vue';

  const sortByOptions = [
    { id: 1, name: 'Most recent', sortBy: '', order: '' },
    { id: 2, name: 'Views (High to Low)', sortBy: 'viewCount', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', sortBy: 'viewCount', order: 'asc' },
    { id: 4, name: 'Duration (Long to Short)', sortBy: 'duration', order: 'desc' },
    { id: 5, name: 'Duration (Short to Long)', sortBy: 'duration', order: 'asc' },
    { id: 6, name: 'Ratings (High to Low)', sortBy: 'ratings', order: 'desc' },
    { id: 7, name: 'Ratings (Low to High)', sortBy: 'ratings', order: 'asc' },
  ];
</script>

<template>
  <VideoListFilter
    :categoryTitle="categoryTitle"
    :fetchVideosFunction="getMostViewOfVideo"
    :sortByOptions="sortByOptions"
  />
</template>
