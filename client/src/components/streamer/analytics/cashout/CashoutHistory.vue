<script setup>
  import { ref, onMounted, watch } from 'vue';
  import {
    formatRating,
    formatDatePosted,
    formatAvgViewTime,
    formatView,
    formatDateData,
    formatNumber,
  } from '@/utils';
  import EmptyPage from '@/pages/EmptyPage.vue';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { getCashoutHistory } from '@services/cashout';
  import { toast } from 'vue3-toastify';
  import FilterDate from '@/components/FilterDate.vue';
  import Filter from '@/components/Filter.vue';
  import Skeleton from 'primevue/skeleton';

  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const sortByStatus = [
    { id: 0, name: 'All' },

    { id: 1, name: 'Completed', value: 'completed' },
    { id: 2, name: 'Pending', value: 'pending' },
    { id: 3, name: 'Cancel', value: 'cancel' },
    { id: 4, name: 'Failed', value: 'failed' },
  ];
  const currentPage = ref(1);
  const totalPage = ref();
  const cashoutHistoryData = ref([]);
  const startDate = ref('');
  const endDate = ref('');
  const totalData = ref(0);
  const selectedPageSize = ref(pageSizeOptions[0].value);
  const isLoadingCashoutHistory = ref(false);
  const selectedSortBy = ref(sortByStatus[0].value);

  const fetchCashoutHistory = async () => {
    isLoadingCashoutHistory.value = true;
    try {
      const response = await getCashoutHistory(
        currentPage.value,
        selectedPageSize.value,
        formatDateData(startDate.value),
        formatDateData(endDate.value),
        selectedSortBy.value,
      );
      cashoutHistoryData.value = response.data.data.listCashout.rows;
      totalData.value = response.data.data.listCashout.count;
      totalPage.value = response.data.data.totalPages;
    } catch (error) {
      toast.error(error.message);
    } finally {
      isLoadingCashoutHistory.value = false;
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchCashoutHistory();
    }
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
      fetchCashoutHistory();
    }
  };

  watch([selectedPageSize, startDate, endDate, selectedSortBy], () => {
    currentPage.value = 1;
    if (startDate.value || endDate.value || selectedPageSize.value || selectedSortBy.value) {
      fetchCashoutHistory();
    }
  });
  const handleSortChange = (newValue) => {
    selectedSortBy.value = newValue.value || '';
  };
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
      <h1 class="text_title">Cashout History</h1>
      <div class="flex gap-8">
        <Filter title="Status" :options="sortByStatus" @change="handleSortChange" />
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

    <Skeleton v-if="isLoadingCashoutHistory" width="100%" height="500px"></Skeleton>

    <div v-else class="card">
      <DataTable
        v-if="cashoutHistoryData.length > 0"
        :value="cashoutHistoryData"
        rowGroupMode="subheader"
        dataKey="id"
        tableStyle="min-width: 50rem, text-align: center"
      >
        <Column field="createdAt" header="Date">
          <template #body="{ data }">
            <div class="space-y-4">
              <div>{{ formatDatePosted(data.createdAt) }}</div>
            </div>
          </template>
        </Column>
        <Column field="rep" header="Bank Holder Name">
          <template #body="{ data }">
            <span>{{ data.bankHolderName }}</span>
          </template>
        </Column>
        <Column field="rep" header="Bank Name">
          <template #body="{ data }">
            <span>{{ data.bankName }}</span>
          </template>
        </Column>
        <Column field="count" header="Bank Number">
          <template #body="{ data }">
            <span> {{ data.bankNumber }}</span>
          </template> </Column
        ><Column field="rep" header="REPs">
          <template #body="{ data }">
            <span class="font-bold"> {{ formatNumber(data.rep) }} REPs </span>
          </template>
        </Column>
        <Column field="amount" header="Amount">
          <template #body="{ data }">
            <span class="font-bold"> US$ {{ data.amount }} </span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span
              :class="{
                'bg-[#d4edda] text-[#28a745] px-2 py-1 rounded-full font-bold':
                  data.status === 'completed',
                'bg-[#fff3cd] text-[#ffc107] px-2 py-1 rounded-full font-bold':
                  data.status === 'pending',
                'bg-[#f8d7da] text-[#dc3545] px-2 py-1 rounded-full font-bold':
                  data.status === 'cancel',
                'bg-[#f8d7da] text-[#dc3545] px-2 py-1 rounded-full font-bold':
                  data.status === 'failed',
              }"
            >
              {{ data.status.charAt(0).toUpperCase() + data.status.slice(1) }}
            </span>
          </template>
        </Column>
        <Column header="Estimated Arrival Date">
          <template #body="{ data }">
            <span>
              {{ formatDatePosted(data.arrivalDate) }}
            </span>
          </template>
        </Column>
        <Column field="" header="" style="display: none"></Column>
      </DataTable>
      <div v-else class="h-full flex justify-center items-center pb-20">
        <EmptyPage
          title="No cashout history found"
          subTitle="No transactions have been made yet. Please try again later."
        />
      </div>
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
</template>
