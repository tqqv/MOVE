<script setup>
  import { getTopVideo } from '@/services/browse';
  import VideoListFilter from './VideoListFilter.vue';

  const sortByOptions = [
    { id: 1, name: 'Most recent', value: '', order: '' },
    { id: 2, name: 'Views (High to Low)', value: 'viewCount', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', value: 'viewCount', order: 'asc' },
    { id: 4, name: 'Duration (Long to Short)', value: 'duration', order: 'desc' },
    { id: 5, name: 'Duration (Short to Long)', value: 'duration', order: 'asc' },
    { id: 6, name: 'Ratings (High to Low)', value: 'ratings', order: 'desc' },
    { id: 7, name: 'Ratings (Low to High)', value: 'ratings', order: 'asc' },
  ];
</script>
<template>
  <VideoListFilter
    title="Top Videos"
    :fetchVideosFunction="getTopVideo"
    :sortByOptions="sortByOptions"
  />
</template>
