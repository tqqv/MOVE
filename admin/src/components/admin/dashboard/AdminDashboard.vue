<script setup>
  import { ref, onMounted } from 'vue';

  import Earning from '@/components/icons/earning.vue';
  import GoLive from '@/components/icons/goLive.vue';
  import Live from '@/components/icons/live.vue';
  import Sales from '@/components/icons/sales.vue';
  import Stream from '@/components/icons/Stream.vue';
  import User from '@/components/icons/user.vue';
  import Videos from '@/components/icons/videos.vue';
  import Wallet from '@/components/icons/wallet.vue';
  import ChartIncome from './ChartIncome.vue';
  import ChartUser from './ChartUser.vue';
  import TopChannel from './TopChannel.vue';
  import TopVideo from './TopVideo.vue';
  import StatisticCard from './StatisticCard.vue';
  import {
    getStatistic,
    getDataChartMoney,
    getTop5Channel,
    getTop5UserDeposit,
  } from '@/services/admin';

  // Make statistics a reactive array
  const statistics = ref([
    { label: 'Total User', icon: User, value: 0 },
    { label: 'Total Video', icon: Videos, value: 0 },
    { label: 'Total live stream', icon: Stream, value: 0 },
    { label: 'Earnings', icon: Wallet, value: 0 },
    { label: 'Withdraw', icon: Sales, value: 0 },
    { label: 'Revenue', icon: Earning, value: 0 },
  ]);
  const topUserDepositData = ref();
  const topChannelData = ref();
  const chartMoneyData = ref();

  const fetchStatistic = async () => {
    try {
      const response = await getStatistic();
      if (response.status === 200) {
        console.log(response);

        statistics.value[0].value = response.data.data.totalUser;
        statistics.value[1].value = response.data.data.totalVideo;
        statistics.value[2].value = response.data.data.totalStream;
        statistics.value[3].value = response.data.data.totalMoneyEarn;
        statistics.value[4].value = response.data.data.totalMoneyWithdraw;
        statistics.value[5].value = response.data.data.revenue;
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchTop5UserDeposit = async () => {
    try {
      const response = await getTop5UserDeposit();
      if (response.status === 200) {
        console.log(response);

        topUserDepositData.value = response.data.data;
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchTop5Channel = async () => {
    try {
      const response = await getTop5Channel();
      if (response.status === 200) {
        console.log(response);

        topChannelData.value = response.data.data;
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchDataChartMoney = async () => {
    try {
      const response = await getDataChartMoney();
      if (response.status === 200) {
        console.log(response);

        chartMoneyData.value = response.data.data;
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  onMounted(() => {
    fetchStatistic();
    fetchTop5UserDeposit();
    fetchTop5Channel();
    fetchDataChartMoney();
  });
</script>

<template>
  <section class="container">
    <!-- INFOR -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatisticCard
        v-for="(stat, index) in statistics"
        :key="index"
        :value="stat.value"
        :label="stat.label"
      >
        <template #icon>
          <component :is="stat.icon" width="22" height="22" />
        </template>
      </StatisticCard>
    </div>
    <!-- CHART -->
    <div class="grid grid-cols-12 gap-4 mt-5">
      <div class="col-span-7 bg-white p-5 rounded shadow">
        <ChartIncome :chartMoneyData="chartMoneyData" />
      </div>
      <div class="col-span-5 bg-white p-5 rounded shadow">
        <ChartUser />
      </div>
    </div>
    <!-- TOP USER -->
    <div class="grid grid-cols-12 gap-4 mt-5 pb-20">
      <TopChannel :topUserDepositData="topUserDepositData" :topChannelData="topChannelData" />
    </div>
  </section>
</template>
