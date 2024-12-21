<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    userTypeData: {
      type: Object,
      required: true,
    },
    isLoadingDashboard: Boolean,
  });

  const pieChart = ref(null);
  let chartInstance = null;

  const createChart = () => {
    const data = {
      labels: ['Users', 'Streamer', 'Admin'],
      datasets: [
        {
          data: [props.userTypeData?.user, props.userTypeData?.streamer, props.userTypeData?.admin],
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
          position: 'top',
        },
      },
    };

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(pieChart.value, {
      type: 'pie',
      data,
      options,
    });
  };

  onMounted(() => {
    Chart.register(...registerables);
    createChart();
  });

  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });

  watch(
    () => props.userTypeData,
    () => {
      createChart();
    },
    { deep: true },
  );
</script>

<template>
  <div class="flex flex-col gap-y-2 h-[400px]">
    <h1 class="text-primary font-bold uppercase">Overview Chart</h1>
    <Skeleton
      v-if="isLoadingDashboard"
      width="10rem"
      height="20px"
      class="flex justify-center items-center mx-auto mb-6"
    />
    <Skeleton
      v-if="isLoadingDashboard"
      width="350px"
      height="400px"
      shape="circle"
      class="flex justify-center items-center mx-auto"
    />

    <div v-else class="h-full">
      <canvas class="pt-6" ref="pieChart"></canvas>
    </div>
  </div>
</template>
