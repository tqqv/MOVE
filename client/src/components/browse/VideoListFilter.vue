<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import EmptyPage from '@/pages/EmptyPage.vue';
  import { useCategoriesStore } from '@/stores';
  import { useLevelWorkoutStore } from '@/stores';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    fetchVideosFunction: {
      type: Function,
      required: true,
    },
    sortByOptions: {
      type: Array,
      required: true,
    },
    categoryTitle: {
      type: String,
      required: true,
    },
    isVisibleCategory: Boolean,
  });

  const categoriesStore = useCategoriesStore();
  const levelWorkoutStore = useLevelWorkoutStore();

  const videos = ref([]);
  const currentPage = ref(1);
  const totalPage = ref();
  const pageSize = ref(8);
  const loading = ref(true);
  const loadingMore = ref(false);
  const isFetchingMore = ref(false);

  const categoryOptions = computed(() => categoriesStore.categoryOptions);
  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkoutOptions);

  const selectCategoryOptions = ref('');
  const selectLevelWorkoutOptions = ref('');
  const selectedSortBy = ref(props.sortByOptions[0].sortBy);
  const selectedOrder = ref(props.sortByOptions[0].order);

  // CREATE PARAM TO BE
  const handleSortChange = (newValue) => {
    selectedSortBy.value = newValue.sortBy || '';
    selectedOrder.value = newValue.order;
  };

  // FETCH VIDEO
  const fetchVideos = async () => {
    try {
      loading.value = true;
      const response = await props.fetchVideosFunction(
        currentPage.value,
        pageSize.value,
        selectLevelWorkoutOptions.value,
        selectCategoryOptions.value || props.categoryTitle,
        selectedSortBy.value,
        selectedOrder.value,
      );
      videos.value = response.data.data.listVideo.rows;
      totalPage.value = response.data.data.totalPages;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  // LOADING MORE
  async function loadMoreData() {
    if (videos.value.length === 0 || isFetchingMore.value || currentPage.value >= totalPage.value)
      return;
    isFetchingMore.value = true;
    loadingMore.value = true;
    currentPage.value += 1;

    try {
      const response = await props.fetchVideosFunction(
        currentPage.value,
        pageSize.value,
        selectLevelWorkoutOptions.value,
        selectCategoryOptions.value || props.categoryTitle,
        selectedSortBy.value,
        selectedOrder.value,
      );
      if (response.data?.data?.listVideo?.rows) {
        videos.value.push(...response.data.data.listVideo.rows);
        totalPage.value = response.data.data.totalPages;
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      isFetchingMore.value = false;
      loadingMore.value = false;
    }
  }
  watch(
    () => props.categoryTitle,
    (newCategoryTitle, oldCategoryTitle) => {
      if (newCategoryTitle !== oldCategoryTitle) {
        currentPage.value = 1;
        fetchVideos();
      }
    },
  );
  watch(categoryOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectCategoryOptions.value) {
      selectCategoryOptions.value = newOptions[0].value || '';
    }
  });

  watch(levelWorkoutOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectLevelWorkoutOptions.value) {
      selectLevelWorkoutOptions.value = newOptions[0].value || '';
      fetchVideos();
    }
  });

  watch(
    [selectLevelWorkoutOptions, selectCategoryOptions, selectedSortBy, selectedOrder],
    (newValues, oldValues) => {
      if (newValues !== oldValues) {
        currentPage.value = 1;
        fetchVideos();
      }
    },
  );

  onMounted(async () => {
    await categoriesStore.fetchCategories();
    await levelWorkoutStore.fetchLevelWorkout();
  });

  onMounted(() => {
    const container = document.querySelector('.flex-1.overflow-y-scroll');
    container?.addEventListener('near-bottom', loadMoreData);
  });

  onUnmounted(() => {
    const container = document.querySelector('.flex-1.overflow-y-scroll');
    if (container) {
      container.removeEventListener('near-bottom', loadMoreData);
    }
  });
</script>

<template>
  <div class="pt-2">
    <div class="hidden gap-y-4 md:flex flex-col lg:flex-row flex-grow items-center justify-between">
      <div class="text-2xl w-full text-center lg:text-start font-bold text-black whitespace-nowrap">
        {{ title }}
      </div>
      <div class="flex gap-x-6">
        <Filter
          title="LEVEL"
          :options="levelWorkoutOptions"
          @change="selectLevelWorkoutOptions = $event.value"
        />
        <Filter
          v-if="isVisibleCategory"
          title="CATEGORY"
          :options="categoryOptions"
          @change="selectCategoryOptions = $event.title"
        />
        <Filter title="SORT BY" :options="sortByOptions" @change="handleSortChange" />
      </div>
    </div>
    <!-- MOBILE -->
    <!-- <div class="flex md:hidden">
      <button
        class="flex items-center gap-x-3 px-4 py-2 bg-primary rounded-lg text-white font-semibold"
      >
        <i class="pi pi-sort-alt text-sm"></i>
        <p>Sort & Filter</p>
      </button>
    </div> -->

    <GirdVideo :videos="videos" :loading="loading" />
    <div
      v-if="loadingMore"
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
    <div v-if="!videos.length && !loading" class="h-full flex justify-center items-center mt-20">
      <EmptyPage
        title="There are no matching videos"
        subTitle="Try different keywords or remove search filters"
      />
    </div>
  </div>
</template>
