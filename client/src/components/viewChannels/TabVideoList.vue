<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import {
    getVideobyChannel,
    getAllLevelWorkout,
    getAllCategory,
    getLevelWorkoutById,
    getCategoryById,
  } from '@/services/video';

  const levelOptions = ref([{ id: 0, name: 'All levels' }]);
  const categoryOptions = ref([{ id: 0, name: 'All categories' }]);

  const sortByOptions = [
    { id: 1, name: 'Most recent' },
    { id: 2, name: 'Views (High to Low)', sortBy: 'viewCount', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', sortBy: 'viewCount', order: 'asc' },
    { id: 4, name: 'Duration (Long to Short)', sortBy: 'duration', order: 'desc' },
    { id: 5, name: 'Duration (Short to Long)', sortBy: 'duration', order: 'asc' },
    { id: 6, name: 'Ratings (High to Low)', sortBy: 'ratings', order: 'desc' },
    { id: 7, name: 'Ratings (Low to High)', sortBy: 'ratings', order: 'asc' },
  ];

  const totalPages = ref(0);
  const videos = ref([]);
  const props = defineProps({
    channelDetails: {
      type: Object,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
  });

  const page = ref(1);
  const pageSize = 9;
  const selectedSortOption = ref(sortByOptions[0]);
  const selectedLevelOption = ref(levelOptions.value[0]);
  const selectedCategoryOption = ref(categoryOptions.value[0]);
  const levelWorkout = ref(null);
  const category = ref(null);
  const fetchLevels = async () => {
    try {
      const { data } = await getAllLevelWorkout();
      levelOptions.value = [
        { id: 0, name: 'All levels' },
        ...data.map((level) => ({ id: level.id, name: level.levelWorkout })),
      ];
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await getAllCategory();
      categoryOptions.value = [
        { id: 0, name: 'All categories' },
        ...data.map((category) => ({ id: category.id, name: category.title })),
      ];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchLevelWorkoutById = async (lvWorkoutId) => {
    try {
      const response = await getLevelWorkoutById(lvWorkoutId);
      levelWorkout.value = response.data.levelWorkout;
      return response.data.levelWorkout;
    } catch (error) {
      console.error('Error fetching level workout:', error);
      return null;
    }
  };
  const fetchCategoryById = async (cateId) => {
    try {
      const response = await getCategoryById(cateId);
      category.value = response.data.title;
      return response.data.title;
    } catch (error) {
      console.error('Error fetching level workout:', error);
      return null;
    }
  };
  const fetchVideos = async () => {
    try {
      const sortBy = selectedSortOption.value.sortBy;
      const order = selectedSortOption.value.order;
      const level =
        selectedLevelOption.value?.name === 'All levels' ? null : selectedLevelOption.value.name;
      const category =
        selectedCategoryOption.value?.name === 'All categories'
          ? null
          : selectedCategoryOption.value.name;

      const result = await getVideobyChannel(
        props.channelId,
        page.value,
        pageSize,
        sortBy,
        order,
        level,
        category,
      );

      const fetchedVideos = result.data.data.videos.rows;

      const updatedVideos = await Promise.all(
        fetchedVideos.map(async (video) => {
          const levelWorkout = await fetchLevelWorkoutById(video.levelWorkoutsId);
          const category = await fetchCategoryById(video.categoryId);
          return {
            ...video,
            levelWorkout,
            category,
          };
        }),
      );

      videos.value = updatedVideos;
      totalPages.value = result.data.data.totalPages;
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  onMounted(() => {
    fetchLevels();
    fetchCategories();
    fetchVideos();
  });

  const onSortByChange = (option) => {
    if (option.id !== selectedSortOption.value.id) {
      selectedSortOption.value = option;
      fetchVideos();
    }
  };

  const onLevelChange = (option) => {
    if (option.id !== selectedLevelOption.value.id) {
      selectedLevelOption.value = option;
      fetchVideos();
    }
  };

  const onCategoryChange = (option) => {
    if (option.id !== selectedCategoryOption.value.id) {
      selectedCategoryOption.value = option;
      fetchVideos();
    }
  };

  const onPageChange = (newPage) => {
    if (newPage <= totalPages.value) {
      page.value = newPage;
      fetchVideos();
    }
  };
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-grow items-center justify-between">
      <div class="whitespace-nowrap text-2xl font-bold text-black">All videos</div>
      <div class="flex gap-x-6">
        <Filter :title="'LEVEL'" :options="levelOptions" @change="onLevelChange" />
        <Filter :title="'CATEGORY'" :options="categoryOptions" @change="onCategoryChange" />
        <Filter :title="'SORT BY'" :options="sortByOptions" @change="onSortByChange" />
      </div>
    </div>
    <div v-if="videos.length > 0">
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
  </div>
</template>
