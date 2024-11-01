<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { formatRating, formatDatePosted, formatAvgViewTime, formatView } from '@/utils';
  import rate from '@/components/icons/rate.vue';
  import rep from '@/components/icons/rep.vue';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { getVideoSetting } from '@services/video';
  import { toast } from 'vue3-toastify';
  import FilterDate from '@/components/FilterDate.vue';
  import Filter from '@/components/Filter.vue';

  const sortByOptions = [
    { id: 1, name: 'Most recent' },
    { id: 2, name: 'Views (High to Low)', sortBy: 'viewCount', order: 'desc' },
    { id: 3, name: 'Views (Low to High)', sortBy: 'viewCount', order: 'asc' },
    { id: 4, name: 'Duration (Long to Short)', sortBy: 'duration', order: 'desc' },
    { id: 5, name: 'Duration (Short to Long)', sortBy: 'duration', order: 'asc' },
    { id: 6, name: 'Ratings (High to Low)', sortBy: 'ratings', order: 'desc' },
    { id: 7, name: 'Ratings (Low to High)', sortBy: 'ratings', order: 'asc' },
  ];
  const sortByTime = [
    { id: 1, name: 'All time' },
    { id: 2, name: 'Last 7 days', days: 7 },
    { id: 3, name: 'Last 30 days', days: 30 },
    { id: 4, name: 'Last 90 days', days: 90 },
    { id: 5, name: '1 year ago', days: 365 },
  ];
  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const currentPage = ref(1);
  const totalPage = ref();
  const totalVideo = ref(0);
  const selectedProduct = ref();
  const videos = ref([]);

  const selectedSortByTime = ref(sortByTime[0].days);
  const selectedSortBy = ref(sortByOptions[0].sortBy);
  const selectedOrder = ref(sortByOptions[0].order);

  const handleSortTimeChange = (newValue) => {
    selectedSortByTime.value = newValue.days || '';
  };
  const handleSortChange = (newValue) => {
    selectedSortBy.value = newValue.sortBy;
    selectedOrder.value = newValue.order;
  };
  const selectedPageSize = ref(pageSizeOptions[0].name);

  const fetchVideos = async () => {
    try {
      const response = await getVideoSetting(
        currentPage.value,
        selectedPageSize.value,
        selectedSortBy.value,
        selectedOrder.value,
        selectedSortByTime.value,
      );
      videos.value = response.data.listVideo.rows;
      totalVideo.value = response.data.listVideo.count;
      totalPage.value = response.data.totalPages;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
    }
  };

  watch([selectedPageSize, selectedSortBy, selectedOrder, selectedSortByTime], () => {
    currentPage.value = 1;
    fetchVideos();
  });

  onMounted(() => {
    fetchVideos();
  });
</script>
<template>
  <div class="container">
    <div class="flex justify-end pb-6">
      <div class="flex gap-8">
        <FilterDate
          title="Start date"
          :options="sortByOptions"
          @change="handleSortChange"
          class="flex-1"
        />
        <FilterDate
          title="End date"
          :options="sortByOptions"
          @change="handleSortChange"
          class="flex-1"
        />
      </div>
    </div>

    <div class="card">
      <DataTable
        v-model:selection="selectedProduct"
        :value="videos"
        rowGroupMode="subheader"
        dataKey="id"
        tableStyle="min-width: 50rem"
      >
        <Column header="Date">
          <template #body="{ data }">
            <div class="space-y-4">
              <div>{{ formatDatePosted(data.createdAt) }}</div>
            </div>
          </template>
        </Column>
        <Column header="Product name">
          <template #body="{ data }">
            <span>{{ formatView(data.viewCount + data.totalViewer) || 0 }}</span>
          </template>
        </Column>
        <Column header="Amount Purchased">
          <template #body="{ data }">
            <span>
              {{ formatAvgViewTime(data.avgViewTime) || '0:00' }}
            </span>
          </template>
        </Column>

        <Column field="" header="" style="display: none"></Column>
      </DataTable>
      <div class="flex justify-end gap-x-12 items-center px-12 py-3">
        <Filter :title="'Rows per page'" :options="pageSizeOptions" v-model="selectedPageSize" />
        <div class="">
          <span>
            {{ (currentPage - 1) * selectedPageSize + 1 }}
          </span>
          -
          <span>
            {{ Math.min(currentPage * selectedPageSize, totalVideo) }}
          </span>
          <span> of {{ totalVideo }} results</span>
        </div>
        <div class="flex gap-x-4 justify-center">
          <i
            @click="goToPreviousPage"
            class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
            :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === 1 }"
          ></i>
          <i
            @click="goToNextPage"
            class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
            :class="{
              'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === totalPage,
            }"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>
