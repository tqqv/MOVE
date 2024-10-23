<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import Chart from 'primevue/chart';

  const props = defineProps({
    ageStats: {
      type: Array,
      required: true,
    },
    totalViewer: {
      type: Number,
      required: true,
    },
  });

  const chartData = ref(null);
  const chartOptions = ref(null);
  const test = computed(() => props.ageStats);

  const setChartData = () => {
    let labels;
    let data;
    if (props.ageStats) {
      labels = props.ageStats.map((stat) => stat.ageGroup);
      data = props.ageStats.map((stat) => stat.viewerCount);
    }
    return {
      labels: labels,
      datasets: [
        {
          label: 'People',
          backgroundColor: '#13D0B4',
          borderColor: '#13D0B4',
          borderRadius: 5,
          barThickness: 20,
          data: data,
        },
      ],
    };
  };

  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  };

  onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  });

  watch(test, (newValue) => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  });
</script>

<template>
  <div
    v-if="chartData && chartOptions && chartData.datasets[0].data.length > 0"
    class="card shadow-lg rounded-lg p-3"
  >
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[13rem]" />
  </div>
  <div v-else>
    <p>No data available</p>
  </div>
</template>
