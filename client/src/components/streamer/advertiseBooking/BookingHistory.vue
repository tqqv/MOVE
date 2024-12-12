<script setup>
  import { ref, onMounted, watch } from 'vue';
  import {
    formatRating,
    formatDatePosted,
    formatAvgViewTime,
    genreDuration,
    formatDateData,
    formatNumber,
    truncateDescripton,
  } from '@/utils';
  import EmptyPage from '@/pages/EmptyPage.vue';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { getBookingHistory, getDateDetailAnalytics } from '@/services/bookingFeaturedContent';
  import { toast } from 'vue3-toastify';
  import FilterDate from '@/components/FilterDate.vue';
  import Filter from '@/components/Filter.vue';
  import Skeleton from 'primevue/skeleton';
  import DetailDateBooking from './step/DetailDateBooking.vue';
  import DetailDateAnalytics from './DetailDateAnalytics.vue';

  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];

  const currentPage = ref(1);
  const totalPage = ref();
  const bookingHistoryData = ref([]);
  const startDate = ref('');
  const endDate = ref('');
  const totalData = ref(0);
  const selectedPageSize = ref(pageSizeOptions[0].value);
  const isLoadingBookingHistory = ref(false);
  const isDateDetailVisible = ref(false);
  const selectedDate = ref('');
  const dateDetails = ref();
  const toggleDateDetailVisible = (date) => {
    fetchDateDetail(date);
    isDateDetailVisible.value = !isDateDetailVisible.value;
  };
  const fetchDateDetail = async (datetime) => {
    try {
      const response = await getDateDetailAnalytics(datetime);
      dateDetails.value = response.data.data.bookingHistory?.rows;
      console.log(dateDetails.value);
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchBookingHistory = async () => {
    try {
      isLoadingBookingHistory.value = true;

      const response = await getBookingHistory(
        currentPage.value,
        selectedPageSize.value,
        formatDateData(startDate.value),
        formatDateData(endDate.value),
      );
      bookingHistoryData.value = response.data.data.bookingHistory?.rows;
      console.log(bookingHistoryData.value);

      totalData.value = response.data.data.bookingHistory.count;
      totalPage.value = response.data.data.totalPages;
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingBookingHistory.value = false;
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;

      fetchBookingHistory();
    }
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;

      fetchBookingHistory();
    }
  };

  watch([selectedPageSize, startDate, endDate], () => {
    currentPage.value = 1;
    if (startDate.value || endDate.value || selectedPageSize.value) {
      fetchBookingHistory();
    }
  });

  watch([selectedPageSize], () => {
    currentPage.value = 1;

    fetchBookingHistory();
  });

  onMounted(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    startDate.value = sevenDaysAgo;
    endDate.value = today;
  });
</script>
<template>
  <section class="container">
    <div class="flex justify-between items-center pb-4">
      <h1 class="text_title">Booking History</h1>
      <div class="flex gap-8">
        <FilterDate
          title="Start date"
          :defaultDate="startDate"
          class="flex-1"
          @change="(date) => (startDate = date)"
        />
        <FilterDate
          title="End date"
          :defaultDate="endDate"
          :startDate="startDate"
          class="flex-1"
          @change="(date) => (endDate = date)"
        />
      </div>
    </div>

    <div class="card">
      <!-- <div
        v-if="bookingHistoryData.length === 0"
        class="h-full flex justify-center items-center pb-20"
      >
        <EmptyPage
          title="No booking history found"
          subTitle="No transactions have been made yet. Please try again later."
        />
      </div> -->
      <DataTable
        :value="bookingHistoryData"
        rowGroupMode="subheader"
        dataKey="id"
        tableStyle="min-width: 50rem, text-align: center"
      >
        <Column header="Date">
          <template #body="{ data }">
            <Skeleton v-if="isLoadingBookingHistory" width="80px" height="20px" />

            <div v-else class="space-y-4">
              <div>{{ formatDatePosted(data.date) }}</div>
            </div>
          </template>
        </Column>

        <Column field="image" header="Video">
          <template #body="{ data }">
            <RouterLink :to="`/video/${data.video.id}`" :key="data.id">
              <img :src="data.video.thumbnailUrl" class="w-[200px] h-[100px] object-cover"
            /></RouterLink>
          </template>
        </Column>
        <Column field="video" header="Details">
          <template #body="{ data }">
            <h1 class="font-bold truncate w-[400px]">{{ data.video?.title }}</h1>
            <h1 v-if="data.video?.category">{{ data.video?.category?.title }}</h1>
            <div class="flex gap-3 mt-2 text-xs">
              <span
                class="bg-[#EEEEEE] rounded-full text-black p-2"
                v-if="data.video?.levelWorkout"
              >
                {{ data.video?.levelWorkout?.levelWorkout }}</span
              >
              <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{
                genreDuration(data.video?.duration)
              }}</span>
            </div>
          </template>
        </Column>

        <Column field="rep" header="REPs">
          <template #body="{ data }">
            <span class="font-bold">
              {{
                formatNumber(data.featuredBase?.pricePerDay || data.featuredAbnormal?.pricePerDay)
              }}
              REPs
            </span>
          </template>
        </Column>
        <Column field="View" header="Action">
          <template #body="{ data }"
            ><div @click="toggleDateDetailVisible(data.date)">
              <i class="pi pi-eye pt-1 cursor-pointer"></i></div></template
        ></Column>

        <Column field="" header=""></Column>
      </DataTable>

      <div class="flex justify-end gap-x-12 items-center p-12">
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
            {{ Math.min(currentPage * selectedPageSize, totalData) }}
          </span>
          <span> of {{ totalData }} results</span>
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
  <DetailDateAnalytics
    @toggleDateDetailVisible="toggleDateDetailVisible"
    :isDateDetailVisible="isDateDetailVisible"
    title="Date Detail Analytics"
  />
</template>
