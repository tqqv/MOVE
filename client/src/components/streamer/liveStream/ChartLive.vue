<template>
  <div id="app">
    <apexchart ref="chart" type="line" height="350" :options="chartOptions" :series="series" />
  </div>
</template>

<script>
  import VueApexCharts from 'vue3-apexcharts';

  export default {
    components: {
      apexchart: VueApexCharts,
    },
    data() {
      return {
        series: [
          {
            data: [],
          },
        ],
        chartOptions: {
          chart: {
            id: 'realtime',
            type: 'line',
            animations: {
              enabled: true,
              easing: 'linear',
              dynamicAnimation: {
                speed: 1000,
              },
            },
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
         
          markers: {
            size: 0,
          },
          xaxis: {
            type: 'datetime',
            range: 30000, // 30 seconds range
          },
          yaxis: {
            max: 100,
          },
          legend: {
            show: false,
          },
        },
        lastDate: Date.now(),
        XAXISRANGE: 30000, // 30 seconds
      };
    },
    methods: {
      getNewSeries(baseval, { min, max }) {
        const newTimestamp = baseval + 1000;
        const newY = Math.floor(Math.random() * (max - min + 1)) + min;

        this.series[0].data.push([newTimestamp, newY]);
        this.lastDate = newTimestamp;

        // Remove old data to keep range consistent
        if (this.series[0].data.length > 20) {
          this.series[0].data.shift();
        }
      },
      resetData() {
        this.series[0].data = [];
      },
    },
    mounted() {
      // Generate initial data
      for (let i = 0; i < 10; i++) {
        this.getNewSeries(this.lastDate, { min: 10, max: 90 });
      }

      // Update chart every second
      this.interval = setInterval(() => {
        this.getNewSeries(this.lastDate, { min: 10, max: 90 });
        this.$refs.chart.updateSeries(this.series);
      }, 1000);

      // Reset data every 60 seconds
      this.resetInterval = setInterval(() => {
        this.resetData();
        this.$refs.chart.updateSeries(this.series, false, true);
      }, 60000);
    },
    beforeDestroy() {
      clearInterval(this.interval);
      clearInterval(this.resetInterval);
    },
  };
</script>

<style scoped>
  #app {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }

  .apexcharts-canvas {
    margin-top: 20px;
  }
</style>
