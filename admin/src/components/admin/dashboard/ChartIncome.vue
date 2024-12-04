<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import Filter from '@/components/Filter.vue';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    chartMoneyData: {
      type: Object,
      required: true,
    },
    isLoadingDashboard: Boolean,
  });
  const emit = defineEmits(['yearSelected']);

  const selectedYear = ref(new Date().getFullYear());
  const availableYears = ref(
    Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: selectedYear.value - 2 + i,
      value: selectedYear.value - 2 + i,
    })),
  );

  const onYearChange = (year) => {
    console.log(year.value);

    selectedYear.value = year.value;

    emit('yearSelected', year.value);
  };

  const lineChart = ref(null);
  let chartInstance = null;

  const formatChartData = (chartMoneyData, year) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // Tháng 1-12
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
    const revenue = months.map(
      (month) =>
        chartMoneyData?.revenue
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
          label: 'Earnings',
          data: earnings,
          borderColor: 'rgb(0, 143, 251,1)',
          backgroundColor: 'rgb(0, 143, 251,0.2)',
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(0, 143, 251,1)',
          pointBorderColor: '#fff',
        },
        {
          label: 'Spend',
          data: spend,
          borderColor: 'rgb(254, 176, 25, 1)',
          backgroundColor: 'rgb(254, 176, 25, 0.2)',
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(254, 176, 25, 1)',
          pointBorderColor: '#fff',
        },
        {
          label: 'Revenue',
          data: revenue,
          borderColor: 'rgb(19, 208, 180)',
          backgroundColor: 'rgb(19, 208, 180, 0.2)',
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(19, 208, 180)',
          pointBorderColor: '#fff',
        },
      ],
    };
  };

  const createChart = () => {
    const data = formatChartData(props.chartMoneyData, selectedYear.value);
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

    chartInstance = new Chart(lineChart.value, {
      type: 'line',
      data,
      options,
    });
  };

  onMounted(() => {
    Chart.register(...registerables);
    createChart();
  });

  watch(
    [() => props.chartMoneyData, selectedYear],
    () => {
      createChart();
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
  <div class="flex flex-col gap-y-4 h-[450px]">
    <div class="flex justify-between">
      <h1 class="text-primary font-bold uppercase">Income Chart</h1>
      <!-- Dropdown chọn năm -->
      <Skeleton v-if="isLoadingDashboard" width="10rem" height="30px" />

      <Filter
        v-else
        title="Select Year"
        :options="availableYears"
        @change="onYearChange"
        :defaultValue="selectedYear"
      />
    </div>
    <Skeleton v-if="isLoadingDashboard" width="100%" height="450px" />

    <!-- Biểu đồ -->
    <div v-else class="h-full">
      <canvas ref="lineChart"></canvas>
    </div>
  </div>
</template>
