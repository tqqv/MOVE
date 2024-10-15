<script setup>
  import { onMounted, ref, watch } from 'vue';
  import Filter from '@components/Filter.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import Paginator from 'primevue/paginator';
  import NotFoundPage from '@/pages/NotFoundPage.vue';
  import { getAllCategories } from '@/services/categories';

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

  const levelOptions = [
    { id: 1, name: 'All levels', value: '' },
    { id: 2, name: 'Beginner', value: 'beginner' },
    { id: 3, name: 'Intermediate', value: 'intermediate' },
    { id: 4, name: 'Advanced', value: 'advanced' },
  ];

  const categoryOptions = ref([{ id: 0, name: 'All categories', title: '' }]);

  const videos = ref([]);
  const categories = ref([]);
  const currentPage = ref(1);
  const totalPage = ref();
  const pageSize = ref(12);

  const selectedLevelOptions = ref(levelOptions[0]?.value || '');
  const selectCategoryOptions = ref(categoryOptions.value[0]?.value || '');
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

  const handleSortChange = (newValue) => {
    selectedSortBy.value = newValue.value || '';
    selectedOrder.value = newValue.order;
  };

  const fetchVideos = async () => {
    try {
      const response = await props.fetchVideosFunction(
        currentPage.value,
        pageSize.value,
        selectedLevelOptions.value,
        selectCategoryOptions.value,
        selectedSortBy.value,
        selectedOrder.value,
      );
      videos.value = response.data.listVideo.rows;
      totalPage.value = response.data.totalPages;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      categories.value = response.data;
      if (Array.isArray(categories.value)) {
        categoryOptions.value.push(
          ...categories.value.map((category) => ({
            id: category.id,
            name: category.title,
            title: category.title,
          })),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  onMounted(() => {
    fetchCategories();
    fetchVideos();
  });

  watch(
    [selectedLevelOptions, selectCategoryOptions, selectedSortBy, selectedOrder],
    (newValues, oldValues) => {
      if (newValues !== oldValues) {
        currentPage.value = 1;
        fetchVideos();
      }
    },
  );
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
          :options="levelOptions"
          @change="selectedLevelOptions = $event.value"
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
    <GirdVideo v-if="videos.length > 0" :videos="videos" />
    <Paginator
      v-if="totalPage > 1"
      :rows="pageSize"
      :first="(currentPage - 1) * pageSize"
      :totalRecords="totalPage * pageSize"
      @page="onPageChange"
    />
    <div v-if="!videos.length" class="h-full flex justify-center items-center mt-20">
      <NotFoundPage
        title="There are no matching videos"
        subTitle="Try different keywords or remove search filters"
      />
    </div>
  </div>
</template>
