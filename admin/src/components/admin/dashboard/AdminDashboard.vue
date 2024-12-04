<script setup>
  import { ref, onMounted } from 'vue';

  import Earning from '@/components/icons/earning.vue';

  import Sales from '@/components/icons/sales.vue';
  import Stream from '@/components/icons/Stream.vue';
  import User from '@/components/icons/user.vue';
  import Videos from '@/components/icons/videos.vue';
  import Wallet from '@/components/icons/wallet.vue';
  import ChartIncome from './ChartIncome.vue';
  import ChartUser from './ChartUser.vue';
  import TopChannel from './TopChannel.vue';
  import StatisticCard from './StatisticCard.vue';
  import Skeleton from 'primevue/skeleton';
  import {
    getStatistic,
    getDataChartMoney,
    getTop5Channel,
    getTop5UserDeposit,
    getDataUserType,
  } from '@/services/admin';

  const selectedYear = ref();

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
  const userTypeData = ref();
  const isLoadingDashboard = ref(false);
  const fetchStatistic = async () => {
    isLoadingDashboard.value = true;
    try {
      const response = await getStatistic();
      if (response.status === 200) {
        statistics.value[0].value = response.data.data.totalUser;
        statistics.value[1].value = response.data.data.totalVideo;
        statistics.value[2].value = response.data.data.totalStream;
        statistics.value[3].value = response.data.data.totalMoneyEarn;
        statistics.value[4].value = response.data.data.totalMoneyWithdraw;
        statistics.value[5].value = response.data.data.revenue;
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingDashboard.value = false;
    }
  };
  const fetchTop5UserDeposit = async () => {
    try {
      const response = await getTop5UserDeposit();
      if (response.status === 200) {
        topUserDepositData.value = response.data.data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchTop5Channel = async () => {
    try {
      const response = await getTop5Channel();
      if (response.status === 200) {
        topChannelData.value = response.data.data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchDataChartMoney = async (year) => {
    try {
      const response = await getDataChartMoney(year);
      if (response.status === 200) {
        chartMoneyData.value = response.data.data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchDataUserType = async (year) => {
    try {
      const response = await getDataUserType(year);
      if (response.status === 200) {
        userTypeData.value = response.data.data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleYearChange = (year) => {
    selectedYear.value = year;

    fetchDataChartMoney(year);
  };

  onMounted(() => {
    fetchStatistic();
    fetchTop5UserDeposit();
    fetchTop5Channel();
    fetchDataChartMoney(selectedYear.value);
    fetchDataUserType();
  });
</script>

<template>
  <section class="container">
    <!-- INFOR -->
    <div v-if="isLoadingDashboard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(stat, index) in statistics.slice(0, 6)" :key="index">
        <Skeleton width="100%" height="100px" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <ChartIncome
          :isLoadingDashboard="isLoadingDashboard"
          :chartMoneyData="chartMoneyData"
          @yearSelected="handleYearChange"
        />

        <!-- Skeleton loader for chart -->
      </div>
      <div class="col-span-5 bg-white p-5 rounded shadow items-center">
        <ChartUser
          class="flex justify-center"
          :userTypeData="userTypeData"
          :isLoadingDashboard="isLoadingDashboard"
        />

        <!-- Skeleton loader for user type chart -->
      </div>
    </div>

    <!-- TOP USER -->
    <div class="grid grid-cols-12 gap-4 mt-5 pb-20">
      <TopChannel
        :isLoadingDashboard="isLoadingDashboard"
        :topUserDepositData="topUserDepositData"
        :topChannelData="topChannelData"
      />

      <!-- Skeleton loader for top user/channel -->
    </div>
  </section>
</template>
