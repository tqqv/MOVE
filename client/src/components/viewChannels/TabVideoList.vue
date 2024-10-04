<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import { getVideobyChannel } from '@/services/video';

  const levelOptions = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Advanced' },
  ];

  const categoryOptions = [
    { id: 1, name: 'All categories' },
    { id: 2, name: 'MMA' },
    { id: 3, name: 'Boxing' },
    { id: 4, name: 'Volleyball' },
  ];
  const sortByOptions = [
    { id: 1, name: 'Most recent' },
    { id: 2, name: 'Views (High to Low)', sortBy: 'viewCount', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', sortBy: 'viewCount', order: 'asc' },
    { id: 4, name: 'Duration (Long to Short)', sortBy: 'duration', order: 'desc' },
    { id: 5, name: 'Duration (Short to Long)', sortBy: 'duration', order: 'asc' },
    { id: 6, name: 'Ratings (High to Low)', sortBy: 'ratings', order: 'desc' },
    { id: 7, name: 'Ratings (Low to High)', sortBy: 'ratings', order: 'asc' },
  ];
  const totalPages = ref([]);

  const videos = ref([]);
  const props = defineProps({
    channelDetails: {
      type: Object,
      required: true,
    },
    channelId: {
      type: Number,
      required: true,
    },
  });

  const page = ref(1);
  const pageSize = 9;

  const selectedSortOption = ref(sortByOptions[0]);

  const getVideo = async (channelId, page, pageSize, sortBy, order, level, category) => {
    try {
      const result = await getVideobyChannel(
        channelId,
        page.value,
        pageSize,
        sortBy,
        order,
        level,
        category,
      );
      videos.value = result.data.data.videos.rows;
      totalPages.value = result.data.data.totalPages;

      console.log('daaaaa', videos.value);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  onMounted(() => {
    getVideo(
      props.channelId,
      page.value,
      pageSize,
      selectedSortOption.value.sortBy,
      selectedSortOption.value.order,
    );
  });

  const onSortByChange = (option) => {
    selectedSortOption.value = option;
  };

  watch(selectedSortOption, (newOption) => {
    getVideo(props.channelId, page.value, pageSize, newOption.sortBy, newOption.order);
  });
  const onPageChange = (newPage) => {
    console.log('Page changed to:', newPage);
    if (newPage > totalPages.value) {
      console.warn('No more videos available for this page');
      return;
    }
    page.value = newPage;
    getVideo(
      props.channelId,
      page.value,
      pageSize,
      selectedSortOption.value.sortBy,
      selectedSortOption.value.order,
    );
  };
</script>

<template>
  <div v-if="videos.length > 0" class="pt-2">
    <div class="flex flex-grow items-center justify-between">
      <div class="whitespace-nowrap text-2xl font-bold text-black">All videos</div>
      <div class="flex gap-x-6">
        <Filter :title="'LEVEL'" :options="levelOptions" />
        <Filter :title="'CATEGORY'" :options="categoryOptions" />
        <Filter :title="'SORT BY'" :options="sortByOptions" @change="onSortByChange" />
      </div>
    </div>
    <GirdVideo
      :totalPages="totalPages"
      :videos="videos"
      :channelDetails="props.channelDetails"
      :page="page"
      :pageSize="pageSize"
      @page-change="onPageChange"
    />
  </div>
  <div v-else class="text-base text-black italic">
    {{ channelDetails.channelName }} has not uploaded any videos yet.
  </div>
</template>
