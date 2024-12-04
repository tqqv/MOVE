<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';

  const props = defineProps({
    chartMoneyData: {
      type: Object,
      required: true,
    },
  });

  const lineChart = ref(null);
  let chartInstance = null;

  const formatChartData = (chartMoneyData) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // Tháng 1-12
    const earnings = months.map(
      (month) => chartMoneyData.moneyEarn.find((data) => data.month === month)?.totalMoney || 0,
    );
    const spend = months.map(
      (month) => chartMoneyData.moneyWithdraw.find((data) => data.month === month)?.totalMoney || 0,
    );
    const revenue = months.map(
      (month) => chartMoneyData.revenue.find((data) => data.month === month)?.totalMoney || 0,
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
    const data = formatChartData(props.chartMoneyData);
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
    };

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
    () => props.chartMoneyData,
    () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
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
  <div class="flex flex-col gap-y-2 h-[400px]">
    <h1 class="text-primary font-bold uppercase">Income Chart</h1>
    <div class="mb-4 h-full">
      <canvas ref="lineChart"></canvas>
    </div>
  </div>
</template>
