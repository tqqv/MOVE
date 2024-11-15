<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import Paginator from 'primevue/paginator';
  import EmptyPage from '@/pages/EmptyPage.vue';
  import { useCategoriesStore } from '@/stores';
  import { useLevelWorkoutStore } from '@/stores';

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
  });

  const levelWorkoutStore = useLevelWorkoutStore();

  const videos = ref([]);
  const currentPage = ref(1);
  const totalPage = ref();
  const pageSize = ref(12);

  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkoutOptions);

  const selectLevelWorkoutOptions = ref('');
  const selectedSortBy = ref(props.sortByOptions[0].sortBy);
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
    selectedSortBy.value = newValue.sortBy || '';
    selectedOrder.value = newValue.order;
  };

  // FETCH VIDEO
  const fetchVideos = async () => {
    try {
      const response = await props.fetchVideosFunction(
        currentPage.value,
        pageSize.value,
        selectLevelWorkoutOptions.value,
        props.categoryTitle,
        selectedSortBy.value,
        selectedOrder.value,
      );
      videos.value = response.data.listVideo.rows;
      totalPage.value = response.data.totalPages;
    } catch (error) {
      console.log(error);
    }
  };

  watch(levelWorkoutOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectLevelWorkoutOptions.value) {
      selectLevelWorkoutOptions.value = newOptions[0].value || '';
    }
  });

  watch(
    [selectLevelWorkoutOptions, props.categoryTitle, , selectedSortBy, selectedOrder],
    (newValues, oldValues) => {
      if (newValues !== oldValues) {
        currentPage.value = 1;
        fetchVideos();
      }
    },
  );

  onMounted(async () => {
    await levelWorkoutStore.fetchLevelWorkout();
    // await fetchVideos();
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
  </div>
</template>
