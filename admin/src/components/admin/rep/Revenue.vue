<script setup>
  import Filter from '@/components/Filter.vue';
  import Sales from '@/components/icons/sales.vue';
  import Wallet from '@/components/icons/wallet.vue';
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  const barChart = ref(null);
  let chartInstance = null;

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

  onMounted(() => {
    Chart.register(...registerables);

    const data = {
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
          label: 'Deposit ($)',
          data: [0, 0, 900, 1500, 2000, 1800, 1300, 1700, 1400, 1100, 1900, 2100],
          backgroundColor: 'rgb(19, 208, 180)',
          hoverOffset: 4,
        },
        {
          label: 'Withdraw ($)',
          data: [0, 0, 700, 1200, 1700, 1400, 1000, 1300, 1100, 900, 1600, 1800],
          backgroundColor: 'rgb(0, 143, 251,1)',
          hoverOffset: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    chartInstance = new Chart(barChart.value, {
      type: 'bar',
      data,
      options,
    });
  });
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
        <h1 class="text-2xl font-semibold">Revenue management</h1>
        <div class="flex flex-col gap-y-2">
          <div class="flex gap-x-2 items-center">
            <Sales width="20" fill="#13d0b4" />
            <span class="font-bold">320,200 USD</span>
          </div>
          <div class="flex gap-x-2 items-center">
            <Wallet width="20" fill="#13d0b4" />
            <span class="font-bold">200,200 USD</span>
          </div>
        </div>
      </div>
      <!-- CHART -->
      <div class="paper-custom my-5 h-[470px]">
        <div class="flex justify-between">
          <h1 class="paper-title">Revenue in 2024</h1>
          <Filter />
        </div>
        <div class="pb-12 h-full">
          <canvas ref="barChart"></canvas>
        </div>
      </div>
      <!-- LIST PEOPLE -->
      <div class="grid grid-cols-12 gap-x-5 my-5">
        <!-- TOP BUY -->
        <div class="col-span-6 my-5 paper-custom">
          <h1 class="paper-title">Reps purchases</h1>
          <DataTable :value="listBuyReps" tableStyle="min-width: 20rem">
            <Column header="Avatar">
              <template #body="slotProps">
                <img :src="slotProps.data.avatar" class="size-12 object-cover rounded-full" />
              </template>
            </Column>
            <Column field="username" header="Username"></Column>
            <Column field="createdAt" header="Date time"></Column>
            <Column field="REPs" header="REPs"></Column>
          </DataTable>
          <div class="flex justify-between items-center mt-4 text-sm px-3">
            <span>1-4 of 12</span>
          </div>
        </div>
        <!-- TOP WI -->

        <div class="col-span-6 my-5 paper-custom">
          <h1 class="paper-title">Reps WITHDRAW</h1>
          <DataTable :value="listBuyReps" tableStyle="min-width: 20rem">
            <Column header="Avatar">
              <template #body="slotProps">
                <img :src="slotProps.data.avatar" class="size-12 object-cover rounded-full" />
              </template>
            </Column>
            <Column field="username" header="Username"></Column>
            <Column field="createdAt" header="Date time"></Column>
            <Column field="REPs" header="REPs"></Column>
          </DataTable>
          <div class="flex justify-between items-center mt-4 text-sm px-3">
            <span>1-4 of 12</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
