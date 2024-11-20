<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import Paginator from 'primevue/paginator';
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
  });

  const categoriesStore = useCategoriesStore();
  const levelWorkoutStore = useLevelWorkoutStore();

  const videos = ref([]);
  const currentPage = ref(1);
  const totalPage = ref();
  const pageSize = ref(12);
  const loading = ref(true);

  const categoryOptions = computed(() => categoriesStore.categoryOptions);
  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkoutOptions);

  const selectCategoryOptions = ref('');
  const selectLevelWorkoutOptions = ref('');
  const selectedSortBy = ref(props.sortByOptions[0].value);
  const selectedOrder = ref(props.sortByOptions[0].order);

  const onPageChange = (event) => {
    const newPage = event.page + 1;
    if (newPage <= totalPage.value) {
      currentPage.value = newPage;
      fetchVideos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // CREATE PARAM TO BE
  const handleSortChange = (newValue) => {
    selectedSortBy.value = newValue.value || '';
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
        selectCategoryOptions.value,
        selectedSortBy.value,
        selectedOrder.value,
      );
      videos.value = response.data.data.listVideo.rows;
      console.log(videos.value);

      totalPage.value = response.data.data.totalPages;
    } catch (error) {
      console.log(error);
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
    await fetchVideos();
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
          title="CATEGORY"
          :options="categoryOptions"
          @change="selectCategoryOptions = $event.title"
        />
        <Filter title="SORT BY" :options="sortByOptions" @change="handleSortChange" />
      </div>
    </div>
    <!-- MOBILE -->
    <div class="flex md:hidden">
      <button
        class="flex items-center gap-x-3 px-4 py-2 bg-primary rounded-lg text-white font-semibold"
      >
        <i class="pi pi-sort-alt text-sm"></i>
        <p>Sort & Filter</p>
      </button>
    </div>
    <div
      v-if="loading"
      class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 h-[230px] gap-x-5 my-8"
    >
      <div v-for="n in 4" :key="n" class="flex flex-col gap-y-3">
        <Skeleton width="100%" height="100%"></Skeleton>
        <Skeleton width="5rem" height="1rem"></Skeleton>
        <Skeleton width="8rem" height="1rem"></Skeleton>
      </div>
    </div>
    <template v-else>
      <GirdVideo v-if="videos.length > 0" :videos="videos" />
      <Paginator
        v-if="totalPage > 1"
        :rows="pageSize"
        :first="(currentPage - 1) * pageSize"
        :totalRecords="totalPage * pageSize"
        @page="onPageChange"
      />
      <div v-if="!videos.length" class="h-full flex justify-center items-center mt-20">
        <EmptyPage
          title="There are no matching videos"
          subTitle="Try different keywords or remove search filters"
        />
      </div>
    </template>
  </div>
</template>
