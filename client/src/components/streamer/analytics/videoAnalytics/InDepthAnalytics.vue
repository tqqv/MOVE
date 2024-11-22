<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabGender from '@components/streamer/analytics/videoAnalytics/TabGender.vue';
  import { useTabStore } from '@/stores/tab.store';
  import { getVideoAnalyticsById } from '@services/video';
  import rate from '@components/icons/rate.vue';
  import { useRoute } from 'vue-router';
  import {
    formatView,
    formatRating,
    formatDatePosted,
    formatAvgViewTime,
    formatNumber,
    truncateDescripton,
  } from '@/utils';
  import TabAge from './TabAge.vue';
  import TabCountry from './TabCountry.vue';
  import Filter from '@/components/Filter.vue';
  import TabNationality from './TabNationality.vue';

  const route = useRoute();
  const videoId = route.params.videoId;
  const videosDetails = ref([{}]);
  const viewersData = ref([]);

  const overviewStats = [{ title: 'Total REPs earned' }, { title: 'Number of shares' }];
  const genderStats = ref(null);
  const ageStats = ref(null);
  const countryStats = ref(null);
  const dataByIp = ref(null);

  const sortByTime = [
    { id: 1, name: 'All time' },
    { id: 2, name: 'Last 7 days', days: 7 },
    { id: 3, name: 'Last 30 days', days: 30 },
    { id: 4, name: 'Last 90 days', days: 90 },
    { id: 5, name: '1 year ago', days: 365 },
  ];
  const scrollableTabs = [
    { title: 'Gender', value: '0', component: TabGender },
    { title: 'Age', value: '1', component: TabAge },
    { title: 'Nationality', value: '2', component: TabNationality },
    { title: 'Country', value: '3', component: TabCountry },
  ];
  const selectedSortByTime = ref(sortByTime[0].days);

  const tabStore = useTabStore();
  const onTabChange = (event) => {
    tabStore.setActiveTab(event.value);
  };
  const activeTab = computed(() => tabStore.activeTab);
  const handleSortTimeChange = (newValue) => {
    selectedSortByTime.value = newValue.days || '';
  };
  const fetchVideosAnalytics = async (videoId) => {
    try {
      const response = await getVideoAnalyticsById(videoId, selectedSortByTime.value);
      videosDetails.value = response.data.videoData;

      viewersData.value = response.data.videoData.viewersData;
      overviewStats[0].value = response.data.videoData.totalReps;
      overviewStats[1].value = response.data.videoData.totalShare;
      genderStats.value = response.data.viewersData.genderData;

      ageStats.value = response.data.viewersData.ageData;
      console.log(ageStats.value);

      countryStats.value = response.data.viewersData.countryData.sort((a, b) => {
        if (a.country === null) return 1;
        if (b.country === null) return -1;
        return a.country.localeCompare(b.country);
      });
      dataByIp.value = response.data.viewersData.dataByIp.sort((a, b) => {
        if (a.country === null) return 1;
        if (b.country === null) return -1;
        return a.country.localeCompare(b.country);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  watch([selectedSortByTime], () => {
    fetchVideosAnalytics(videoId);
  });

  onMounted(() => {
    fetchVideosAnalytics(videoId);
  });
</script>
<template>
  <div class="container">
    <RouterLink to="/dashboard-streamer/video-analytics">
      <div class="flex items-center text-primary text-base pt-4">
        <i class="pi pi-angle-left"></i>
        <span class="ml-2">Back to video analytics</span>
      </div>
    </RouterLink>
    <div class="flex justify-between">
      <h1 class="py-2 px-4 font-bold text-[24px]">In-depth analytics</h1>
      <div class="p-4">
        <Filter title="SHOW" :options="sortByTime" @change="handleSortTimeChange" class="flex-1" />
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 p-2">
      <!-- Col 1 -->

      <div class="space-y-4">
        <div class="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
          <img :src="videosDetails.thumbnailUrl" class="object-cover w-full h-full" />
        </div>

        <div class="space-y-2">
          <div class="text-base font-bold truncate" :title="videosDetails.title">
            {{ truncateDescripton(videosDetails.title, 55) }}
          </div>
          <div class="text-[#666666] text-sm">{{ videosDetails.category?.title }}</div>
        </div>
        <div class="pt-2 space-y-4">
          <div class="flex justify-between">
            <span class="text-sm uppercase text-[#666666]">Views</span>
            <span class="text-sm">{{ formatView(videosDetails.viewCount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm uppercase text-[#666666]">avg. view time</span>
            <span class="text-sm">{{ formatAvgViewTime(videosDetails.avgViewTime) }} </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm uppercase text-[#666666]">Ratings</span>
            <div class="flex items-center">
              <span class="text-sm">{{ formatRating(videosDetails.ratings) }}</span>
              <rate class="ml-1 mb-1" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm uppercase text-[#666666]">Published on</span>
            <div class="flex items-center">
              <span class="text-sm">{{ formatDatePosted(videosDetails.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Col 2  -->
      <div class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 w-full lg:w-2/3">
          <StatsCard
            v-for="(stat, index) in overviewStats"
            :key="index"
            :title="stat.title"
            :value="stat.value"
            :percent="stat.percent"
          />
        </div>
        <div>
          <span class="text-base font-bold pl-4">Demographics</span>
          <Tabs :value="activeTab" @tab-change="onTabChange" scrollable class="mb-4 w-full">
            <TabList>
              <Tab v-for="tab in scrollableTabs" :key="tab.value" :value="tab.value">
                {{ tab.title }}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel v-for="tab in scrollableTabs" :key="tab.value" :value="tab.value">
                <component
                  v-if="ageStats"
                  :is="tab.component"
                  :genderStats="genderStats"
                  :totalViewer="videosDetails.totalViewer"
                  :ageStats="ageStats"
                  :countryStats="countryStats"
                  :dataByIp="dataByIp"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
