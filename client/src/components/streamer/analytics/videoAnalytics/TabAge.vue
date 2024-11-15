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

  const defaultAgeGroups = [
    { ageGroup: 'Under 18', viewerCount: 0 },
    { ageGroup: '18-24', viewerCount: 0 },
    { ageGroup: '25-34', viewerCount: 0 },
    { ageGroup: '35-44', viewerCount: 0 },
    { ageGroup: '45-54', viewerCount: 0 },
    { ageGroup: '55-64', viewerCount: 0 },
    { ageGroup: '64 above', viewerCount: 0 },
    { ageGroup: 'Unknown', viewerCount: 0 },
  ];

  const test = computed(() => props.ageStats);

  const setChartData = () => {
    const mergedStats = defaultAgeGroups.map((defaultGroup) => {
      const foundStat = props.ageStats.find((stat) => stat.ageGroup === defaultGroup.ageGroup);
      return {
        ...defaultGroup,
        viewerCount: foundStat ? foundStat.viewerCount || 0 : 0,
      };
    });

    const labels = mergedStats.map((stat) => stat.ageGroup);
    const data = mergedStats.map((stat) => stat.viewerCount);

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

  watch(test, () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  });
</script>

<template>
  <div v-if="chartData && chartOptions" class="card shadow-lg rounded-lg p-3 w-full">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[13rem]" />
  </div>
</template>
