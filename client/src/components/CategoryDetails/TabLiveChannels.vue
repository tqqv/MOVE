<script setup>
  import { computed, onMounted, ref, watch } from 'vue';

  import { getLiveStream } from '@/services/liveStream';
  import LiveStreamFilter from './LiveStreamFilter.vue';
  const props = defineProps({
    categoryTitle: {
      type: String,
    },
  });
  const currentCategoryTitle = ref(props.categoryTitle);

  watch(
    () => props.categoryTitle,
    (newCategoryTitle) => {
      currentCategoryTitle.value = newCategoryTitle;
    },
  );
  const sortByOptions = [
    { id: 1, name: 'Most recent' },
    { id: 2, name: 'Views (High to Low)', sortBy: 'totalView', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', sortBy: 'totalView', order: 'asc' },
    { id: 4, name: 'Ratings (High to Low)', sortBy: 'avgRates', order: 'desc' },
    { id: 5, name: 'Ratings (Low to High)', sortBy: 'avgRates', order: 'asc' },
  ];
</script>

<template>
  <LiveStreamFilter
    :categoryTitle="currentCategoryTitle"
    :fetchLiveStreamFunction="getLiveStream"
    :sortByOptions="sortByOptions"
  />
</template>
