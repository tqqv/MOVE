<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Chart, registerables } from 'chart.js';

  const pieChart = ref(null);
  let chartInstance = null;

  onMounted(() => {
    Chart.register(...registerables);

    const data = {
      labels: ['Users', 'Videos', 'Livestreams'],
      datasets: [
        {
          data: [1200, 500, 150],
          backgroundColor: ['rgb(19, 208, 180)', 'rgb(103, 191, 255)', 'rgba(153, 102, 255, 0.7)'],
          hoverOffset: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top', // Vị trí chú thích
        },
      },
    };

    chartInstance = new Chart(pieChart.value, {
      type: 'pie',
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
    <h1 class="text-primary font-bold uppercase">Overview Chart</h1>
    <div class="mb-4 h-full">
      <canvas ref="pieChart"></canvas>
    </div>
  </div>
</template>
