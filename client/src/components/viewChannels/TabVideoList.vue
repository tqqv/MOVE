<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import { getVideobyChannel } from '@/services/video';
  import { useCategoriesStore } from '@/stores';
  import { useLevelWorkoutStore } from '@/stores';
  import Paginator from 'primevue/paginator';
  import NotFoundPage from '@/pages/EmptyPage.vue';
  import Skeleton from 'primevue/skeleton';

  const categoriesStore = useCategoriesStore();
  const levelWorkoutStore = useLevelWorkoutStore();

  const sortByOptions = [
    { id: 1, name: 'Most recent', sortBy: '', order: '' },
    { id: 2, name: 'Views (High to Low)', sortBy: 'viewCount', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', sortBy: 'viewCount', order: 'asc' },
    { id: 4, name: 'Duration (Long to Short)', sortBy: 'duration', order: 'desc' },
    { id: 5, name: 'Duration (Short to Long)', sortBy: 'duration', order: 'asc' },
    { id: 6, name: 'Ratings (High to Low)', sortBy: 'ratings', order: 'desc' },
    { id: 7, name: 'Ratings (Low to High)', sortBy: 'ratings', order: 'asc' },
  ];

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
  const totalPages = ref(0);
  const page = ref(1);
  const pageSize = 12;
  const loading = ref(true);
  const selectCategoryOptions = ref('');
  const selectLevelWorkoutOptions = ref('');
  const selectedSortBy = ref(sortByOptions[0].sortBy);
  const selectedOrder = ref(sortByOptions[0].order);
  const categoryOptions = computed(() => categoriesStore.categoryOptions);
  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkoutOptions);
  const onPageChange = (event) => {
    const newPage = event.page + 1;
    if (newPage <= totalPages.value) {
      page.value = newPage;
      fetchVideos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleSortChange = (newValue) => {
    selectedSortBy.value = newValue.sortBy || '';
    selectedOrder.value = newValue.order;
  };
  const fetchVideos = async () => {
    try {
      const result = await getVideobyChannel(
        props.channelId,
        page.value,
        pageSize,
        selectedSortBy.value,
        selectedOrder.value,
        selectLevelWorkoutOptions.value,
        selectCategoryOptions.value,
      );
      const fetchedVideos = result.data.data.videos.rows;
      videos.value = fetchedVideos;
      totalPages.value = result.data.data.totalPages;
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      loading.value = false;
    }
  };

  watch(categoryOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectCategoryOptions.value) {
      selectCategoryOptions.value = newOptions[0].value || '';
    }
  });

  watch(levelWorkoutOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectLevelWorkoutOptions.value) {
      selectLevelWorkoutOptions.value = newOptions[0].value || '';
    }
  });
  watch(
    () => props.channelId,
    (newId) => {
      fetchVideos();
    },
  );
  watch(
    [selectLevelWorkoutOptions, selectCategoryOptions, selectedSortBy, selectedOrder],
    (newValues, oldValues) => {
      if (newValues !== oldValues) {
        page.value = 1;
        fetchVideos();
      }
    },
  );

  onMounted(async () => {
    await categoriesStore.fetchCategories();
    await levelWorkoutStore.fetchLevelWorkout();
    await fetchVideos();
  });
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-col-reverse lg:flex-row flex-grow items-center justify-between">
      <div class="whitespace-nowrap text-2xl font-bold text-black">All videos</div>
      <div class="flex flex-col lg:flex-row gap-6 mb-3">
        <Filter
          title="LEVEL"
          :options="levelWorkoutOptions"
          @change="selectLevelWorkoutOptions = $event.value"
          class="flex-1"
        />
        <Filter
          title="CATEGORY"
          :options="categoryOptions"
          @change="selectCategoryOptions = $event.title"
          class="flex-1"
        />
        <Filter
          title="SORT BY"
          :options="sortByOptions"
          @change="handleSortChange"
          class="flex-1"
        />
      </div>
    </div>

    <div>
      <GirdVideo
        :totalPages="totalPages"
        :videos="videos"
        :channelDetails="props.channelDetails"
        :page="page"
        :pageSize="pageSize"
        @page-change="onPageChange"
        :loading="loading"
      />
      <Paginator
        v-if="totalPages > 1 && videos.length > 0"
        :rows="pageSize"
        :first="(page - 1) * pageSize"
        :totalRecords="totalPages * pageSize"
        @page="onPageChange"
      />
    </div>

    <div v-if="!videos.length && !loading" class="h-full flex justify-center items-center mt-20">
      <NotFoundPage
        title="There are no matching videos"
        subTitle="Try different keywords or remove search filters"
      />
    </div>
  </div>
</template>
