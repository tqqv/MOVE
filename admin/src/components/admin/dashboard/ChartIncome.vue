<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Chart, registerables } from 'chart.js';

  const lineChart = ref(null);
  let chartInstance = null;
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
          label: 'Earnings',
          data: [0, 2, 43, 12, 10, 32, 0, 0, 43, 40, 32, 90],
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
          data: [12, 30, 25, 50, 60, 75, 80, 85, 100, 90, 95, 110],
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
          data: [5, 10, 15, 20, 25, 30, 35, 45, 55, 65, 75, 85],
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

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
    };

    // Khởi tạo biểu đồ
    chartInstance = new Chart(lineChart.value, {
      type: 'line',
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
  <div class="flex flex-col gap-y-2 h-[400px]">
    <h1 class="text-primary font-bold uppercase">Income Chart</h1>
    <div class="mb-4 h-full">
      <canvas ref="lineChart"></canvas>
    </div>
  </div>
</template>
