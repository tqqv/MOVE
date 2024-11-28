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
  import { getPaymentHistory } from '@services/payment';
  import { toast } from 'vue3-toastify';
  import FilterDate from '@/components/FilterDate.vue';
  import Filter from '@/components/Filter.vue';
  import Skeleton from 'primevue/skeleton';

  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const currentPage = ref(1);
  const totalPage = ref();
  const paymentHistoryData = ref([]);
  const startDate = ref('');
  const endDate = ref('');
  const totalData = ref(0);
  const selectedPageSize = ref(pageSizeOptions[0].value);
  const isLoadingPaymentHistory = ref(false);

  const fetchPaymentHistory = async () => {
    isLoadingPaymentHistory.value = true;
    try {
      const response = await getPaymentHistory(
        currentPage.value,
        selectedPageSize.value,
        formatDateData(startDate.value),
        formatDateData(endDate.value),
      );
      paymentHistoryData.value = response.data.data.list;
      totalData.value = response.data.data.count;
      totalPage.value = response.data.data.totalPages;
    } catch (error) {
      toast.error(error.message);
    } finally {
      isLoadingPaymentHistory.value = false;
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchPaymentHistory();
    }
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
      fetchPaymentHistory();
    }
  };

  watch([selectedPageSize, startDate, endDate], () => {
    currentPage.value = 1;
    if (startDate.value || endDate.value || selectedPageSize.value) {
      fetchPaymentHistory();
    }
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
  <div class="container">
    <div class="flex justify-end pb-6">
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
    <Skeleton v-if="isLoadingPaymentHistory" width="100%" height="500px"></Skeleton>

    <div v-else class="card">
      <DataTable
        v-if="paymentHistoryData.length > 0"
        :value="paymentHistoryData"
        rowGroupMode="subheader"
        dataKey="id"
        tableStyle="min-width: 50rem, text-align: center"
      >
        <Column field="created_date" header="Date">
          <template #body="{ data }">
            <div class="space-y-4">
              <div>{{ formatDatePosted(data.created_date) }}</div>
            </div>
          </template>
        </Column>
        <Column field="rep" header="Product name">
          <template #body="{ data }">
            <span class="font-bold">{{ formatNumber(data.rep) }} REPs</span>
          </template>
        </Column>
        <Column field="count" header="Amount Purchased">
          <template #body="{ data }">
            <span>
              {{ data.count }}
            </span>
          </template>
        </Column>

        <Column field="" header="" style="display: none"></Column>
      </DataTable>
      <div v-else class="h-full flex justify-center items-center pb-20">
        <EmptyPage
          title="No payment history found"
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
  </div>
</template>
