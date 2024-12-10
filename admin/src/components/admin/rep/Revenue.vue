<script setup>
  import Filter from '@/components/Filter.vue';
  import Sales from '@/components/icons/sales.vue';
  import Wallet from '@/components/icons/wallet.vue';
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Skeleton from 'primevue/skeleton';
  import { getListUserPayIn, getListUserPayOut, getRevenue } from '@/services/admin';
  import { data } from 'autoprefixer';
  import { formatTimeDate } from '@/utils';

  const barChart = ref(null);
  let chartInstance = null;
  const moneyEarned = ref(null);
  const moneyWithdraw = ref(null);
  const dataRevenue = ref({
    moneyEarn: [],
    moneyWithdraw: [],
  });

  const pagePayIn = ref(1);
  const pageSizePayIn = ref(5);
  const totalUserPayIn = ref(0);
  const totalPageUserPayIn = ref();
  const listUserPayIn = ref([]);

  // PAYOUT
  const pagePayOut = ref(1);
  const pageSizePayOut = ref(5);
  const totalUserPayOut = ref(0);
  const totalPageUserPayOut = ref();
  const listUserPayOut = ref([]);
  // SELECT YEAR
  const isLoadingDashboard = ref(true);
  const currentYear = new Date().getFullYear();
  const selectedYear = ref(new Date().getFullYear());
  const listYear = ref(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: currentYear - 2 + i,
      value: currentYear - 2 + i,
    })),
  );

  const handleYearChange = (year) => {
    selectedYear.value = year;
    fetchRevenue();
  };

  const fetchRevenue = async () => {
    try {
      isLoadingDashboard.value = true;
      const response = await getRevenue(selectedYear.value?.name);
      moneyEarned.value = response.data.data.totalPayment;
      moneyWithdraw.value = response.data.data.totalWithdraw;
      dataRevenue.value.moneyEarn = response.data.data.moneyEarn;
      dataRevenue.value.moneyWithdraw = response.data.data.moneyWithdraw;
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingDashboard.value = false;
    }
  };

  const listBuyReps = ref([
    {
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_1',
      createdAt: '18:20 - Dec 2, 2024 ',
      REPs: 5000,
    },
    {
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_2',
      createdAt: '18:20 - Dec 2, 2024 ',

      REPs: 2500,
    },
    {
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_3',
      createdAt: '18:20 - Dec 2, 2024 ',

      REPs: 8000,
    },
    {
      avatar:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_4',
      createdAt: '18:20 - Dec 2, 2024 ',

      REPs: 1500,
    },
    {
      avatar:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_5',
      createdAt: '18:20 - Dec 2, 2024 ',

      REPs: 6000,
    },
  ]);
  // CREATE CHART
  const formatChartData = (chartMoneyData, year) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const earnings = months.map(
      (month) =>
        chartMoneyData?.moneyEarn
          .filter((data) => data.year === year)
          .find((data) => data.month === month)?.totalMoney || 0,
    );
    const spend = months.map(
      (month) =>
        chartMoneyData?.moneyWithdraw
          .filter((data) => data.year === year)
          .find((data) => data.month === month)?.totalMoney || 0,
    );

    return {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Earning ($)',
          data: earnings,
          backgroundColor: 'rgb(19, 208, 180)',
          hoverOffset: 4,
        },
        {
          label: 'Withdraw ($)',
          data: spend,
          backgroundColor: 'rgb(0, 143, 251,1)',
          hoverOffset: 4,
        },
      ],
    };
  };

  const createdChart = () => {
    if (!barChart.value) {
      return;
    }
    const data = formatChartData(dataRevenue.value, selectedYear.value?.name);
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          ticks: {
            callback: function (value) {
              return '$' + value.toLocaleString();
            },
          },
        },
      },
    };

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(barChart.value.getContext('2d'), {
      type: 'bar',
      data,
      options,
    });
  };

  // GET EARNING
  const fetchListUserPayIn = async () => {
    try {
      const response = await getListUserPayIn(pagePayIn.value, pageSizePayIn.value);
      listUserPayIn.value = response.data.data.list.rows;
      totalUserPayIn.value = response.data.data.list.count;
      totalPageUserPayIn.value = response.data.data.totalPages;
    } catch (error) {
      console.log(error);
    }
  };

  const goToPreviousPage = () => {
    if (pagePayIn.value > 1) {
      pagePayIn.value--;
      fetchListUserPayIn();
    }
  };

  const goToNextPage = () => {
    if (pagePayIn.value < totalPageUserPayIn.value) {
      pagePayIn.value++;
      fetchListUserPayIn();
    }
  };

  // WITHDRAW
  const fetchListUserPayOut = async () => {
    try {
      const response = await getListUserPayOut(pagePayOut.value, pageSizePayOut.value);
      listUserPayOut.value = response.data.data.list.rows;
      totalUserPayOut.value = response.data.data.list.count;
      totalPageUserPayOut.value = response.data.data.totalPages;
    } catch (error) {
      console.log(error);
    }
  };

  const goToPreviousPagePayOut = () => {
    if (pagePayOut.value > 1) {
      pagePayOut.value--;
      fetchListUserPayOut();
    }
  };

  const goToNextPagePayOut = () => {
    if (pagePayOut.value < totalPageUserPayOut.value) {
      pagePayOut.value++;
      fetchListUserPayOut();
    }
  };

  onMounted(async () => {
    Chart.register(...registerables);
    await createdChart();
    fetchListUserPayIn();
    fetchListUserPayOut();
  });

  watch(
    [() => dataRevenue, selectedYear],
    () => {
      createdChart();
    },
    { deep: true },
  );

  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>
<template>
  <section>
    <div class="container">
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold">Revenue management</h1>
      </div>
      <!-- CHART -->
      <div class="paper-custom my-5 h-[590px]">
        <div class="flex justify-between">
          <div class="flex flex-col gap-y-2 mb-3">
            <h1 class="paper-title">Revenue in {{ selectedYear?.name }}</h1>
            <div class="flex items-start flex-col gap-y-2 ml-2">
              <div v-if="isLoadingDashboard" class="flex flex-col gap-y-3 items-center">
                <Skeleton width="8rem" />
                <Skeleton width="8rem" />
              </div>
              <div v-if="!isLoadingDashboard" class="flex gap-x-2 items-center">
                <Sales width="20" fill="#13d0b4" />
                <span class="font-bold">{{ (moneyEarned ?? 0).toFixed(2) }} USD</span>
              </div>
              <div v-if="!isLoadingDashboard" class="flex gap-x-2 items-center">
                <Wallet width="20" fill="#13d0b4" />
                <span class="font-bold">{{ (moneyWithdraw ?? 0).toFixed(2) }} USD</span>
              </div>
            </div>
          </div>

          <div>
            <Filter
              title="Select Year"
              :options="listYear"
              @change="handleYearChange"
              :defaultValue="selectedYear"
            />
          </div>
        </div>
        <div class="pb-32 h-full">
          <canvas ref="barChart"></canvas>
        </div>
      </div>
      <!-- LIST PEOPLE -->
      <div class="grid grid-cols-12 gap-x-5 my-5 text-xs">
        <!-- TOP BUY -->
        <div class="col-span-6 my-5 paper-custom h-fit">
          <h1 class="paper-title">Reps earning</h1>
          <DataTable :value="listUserPayIn" tableStyle="min-width: 20rem">
            <Column header="Avatar">
              <template #body="slotProps">
                <img
                  :src="slotProps.data.User.avatar"
                  class="size-10 object-cover rounded-full flex-shrink-0"
                />
              </template>
            </Column>
            <Column field="username" header="Username">
              <template #body="slotProps">
                {{ slotProps.data.User.username }}
              </template></Column
            >
            <Column header="Date time">
              <template #body="slotProps">
                {{ formatTimeDate(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column field="rep" header="REPs"></Column>
            <Column field="amount" header="Amount (SGD)"></Column>
          </DataTable>
          <div class="flex justify-between items-center mt-4 text-sm px-3">
            <div class="">
              <span>
                {{ (pagePayIn - 1) * pageSizePayIn + 1 }}
              </span>
              -
              <span>
                {{ Math.min(pagePayIn * pageSizePayIn, totalUserPayIn) }}
              </span>
              <span> of {{ totalUserPayIn }} results</span>
            </div>
            <div class="flex gap-x-4 justify-center">
              <i
                @click="goToPreviousPage"
                class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
                :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': pagePayIn === 1 }"
              ></i>
              <i
                @click="goToNextPage"
                class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
                :class="{
                  'text-gray-dark hover:text-gray-dark cursor-auto':
                    pagePayIn === totalPageUserPayIn,
                }"
              ></i>
            </div>
          </div>
        </div>
        <!-- TOP WITH DRAW -->

        <div class="col-span-6 my-5 paper-custom h-fit">
          <h1 class="paper-title">Reps WITHDRAW</h1>
          <DataTable :value="listUserPayOut" tableStyle="min-width: 20rem">
            <Column header="Avatar">
              <template #body="slotProps">
                <img
                  :src="slotProps.data.Channel.avatar"
                  class="size-10 object-cover rounded-full flex-shrink-0"
                />
              </template>
            </Column>
            <Column field="username" header="Channel name">
              <template #body="slotProps">
                {{ slotProps.data.Channel.username }}
              </template></Column
            >
            <Column header="Date time">
              <template #body="slotProps">
                {{ formatTimeDate(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column field="rep" header="REPs"></Column>
            <Column field="amount" header="Amount (SGD)"></Column>
          </DataTable>
          <div class="flex justify-between items-center mt-4 text-sm px-3">
            <div class="">
              <span>
                {{ (pagePayOut - 1) * pageSizePayOut + 1 }}
              </span>
              -
              <span>
                {{ Math.min(pagePayOut * pageSizePayOut, totalUserPayOut) }}
              </span>
              <span> of {{ totalUserPayOut }} results</span>
            </div>
            <div class="flex gap-x-4 justify-center">
              <i
                @click="goToPreviousPagePayOut"
                class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
                :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': pagePayOut === 1 }"
              ></i>
              <i
                @click="goToNextPagePayOut"
                class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
                :class="{
                  'text-gray-dark hover:text-gray-dark cursor-auto':
                    pagePayOut === totalPageUserPayOut,
                }"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
