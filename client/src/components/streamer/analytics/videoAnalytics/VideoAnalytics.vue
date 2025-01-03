<script setup>
  import { ref, onMounted, watch } from 'vue';
  import {
    formatRating,
    formatDatePosted,
    formatAvgViewTime,
    formatView,
    formatNumber,
    truncateDescripton,
  } from '@/utils';
  import rate from '@/components/icons/rate.vue';
  import rep from '@/components/icons/rep.vue';
  import Skeleton from 'primevue/skeleton';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { getVideoSetting } from '@services/video';
  import { toast } from 'vue3-toastify';
  import Filter from '@/components/Filter.vue';
  import EmptyPage from '@/pages/EmptyPage.vue';

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
  const isLoadingVideoAnalytics = ref(false);
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
    } finally {
      isLoadingVideoAnalytics.value = false;
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      isLoadingVideoAnalytics.value = true;

      fetchVideos();
    }
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
      isLoadingVideoAnalytics.value = true;

      fetchVideos();
    }
  };

  watch([selectedPageSize, selectedSortBy, selectedOrder, selectedSortByTime], () => {
    currentPage.value = 1;
    fetchVideos();
  });
</script>
<template>
  <section class="container">
    <div class="flex justify-between pb-4">
      <h1 class="font-bold text-[24px]">Video analytics</h1>
      <div class="flex gap-8">
        <Filter
          title="SORT BY"
          :options="sortByOptions"
          @change="handleSortChange"
          class="flex-1"
        />
        <Filter title="SHOW" :options="sortByTime" @change="handleSortTimeChange" class="flex-1" />
      </div>
    </div>
    <div class="card mt-4" v-for="n in 10" :key="n" v-if="isLoadingVideoAnalytics">
      <div class="px-4 flex align-center items-center gap-x-6">
        <Skeleton width="200px" height="100px"></Skeleton>
        <div class="pl-[65px] space-y-4">
          <div>
            <Skeleton width="15rem"></Skeleton> <Skeleton width="5rem" class="mt-2"></Skeleton>
          </div>
          <Skeleton width="5rem"></Skeleton>
        </div>
        <Skeleton width="5rem" class="ml-[270px]"></Skeleton>
        <Skeleton width="5rem" class="ml-[40px]"></Skeleton>
        <Skeleton width="5rem" class="ml-[40px]"></Skeleton>
        <Skeleton width="5rem" class="ml-[40px]"></Skeleton>
        <Skeleton width="5rem" class="ml-[40px]"></Skeleton>
      </div>
    </div>
    <div v-else class="card">
      <DataTable
        v-model:selection="selectedProduct"
        :value="videos"
        rowGroupMode="subheader"
        dataKey="id"
        tableStyle="min-width: 50rem"
      >
        <Column header="Videos">
          <template #body="{ data }">
            <RouterLink :to="`/dashboard-streamer/video-analytics/${data.id}`" :key="data.id">
              <img :src="data.thumbnailUrl" class="w-[180px] h-[100px] object-cover" />
            </RouterLink>
          </template>
        </Column>
        <Column header="Details">
          <template #body="{ data }">
            <div class="space-y-4">
              <div>
                <h1 :title="data.title" class="font-bold">
                  {{ truncateDescripton(data.title, 23) }}
                </h1>
                <h1 v-if="data.category">{{ data.category.title }}</h1>
              </div>
              <div>{{ formatDatePosted(data.createdAt) }}</div>
            </div>
          </template>
        </Column>
        <Column header="Views">
          <template #body="{ data }">
            <span>{{ formatView(data.viewCount) || 0 }}</span>
          </template>
        </Column>
        <Column header="Avg. view time">
          <template #body="{ data }">
            <span>
              {{ formatAvgViewTime(data.avgViewTime) || '0:00' }}
              ({{ ((data.avgViewTime / data.duration) * 100).toFixed(0) }}%)
            </span>
          </template>
        </Column>
        <Column header="Ratings">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span>{{ formatRating(data.ratings) || 0 }}</span>
              <rate class="scale-125" />
            </div>
          </template>
        </Column>
        <Column header="REPs Received">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <rep /><span>{{ formatNumber(data.totalReps) || 0 }}</span>
            </div>
          </template></Column
        >

        <Column header="Viewer Gifted">
          <template #body="{ data }">
            <span>{{ formatNumber(data.viewerGift) }}</span>
          </template>
        </Column>

        <Column field="" header="" style="display: none"></Column>
      </DataTable>
      <div v-if="!videos.length" class="h-full flex justify-center items-center mt-20">
        <EmptyPage title="No videos found" subTitle="Upload a new video to track analytics" />
      </div>
      <div v-else class="flex justify-end gap-x-12 items-center px-12 py-3">
        <Filter
          :title="'Rows per page'"
          :options="pageSizeOptions"
          @change="selectedPageSize = $event.value"
        />
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
  </section>
</template>
