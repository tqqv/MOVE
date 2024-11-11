<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabGender from '@components/streamer/analytics/liveStreamAnalytics/TabGender.vue';
  import { useTabStore } from '@/stores/tab.store';
  import { getVideoAnalyticsById } from '@services/video';
  import rate from '@components/icons/rate.vue';
  import { useRoute } from 'vue-router';
  import { formatView, formatRating, formatDatePosted, formatAvgViewTime } from '@/utils';
  import TabAge from '@components/streamer/analytics/videoAnalytics/TabAge.vue';
  import TabCountry from '@components/streamer/analytics/videoAnalytics/TabCountry.vue';
  import Filter from '@/components/Filter.vue';

  const route = useRoute();
  const videoId = route.params.videoId;
  const videosDetails = ref([{}]);
  const viewersData = ref([]);

  const overviewStats = [
    { title: 'Total REPs earned' },
    { title: 'New followers' },
    { title: 'Number of shares' },
  ];
  const genderStats = ref(null);
  const ageStats = ref(null);
  const countryStats = ref(null);

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
    { title: 'Country', value: '2', component: TabCountry },
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
      countryStats.value = response.data.viewersData.countryData;
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
    <div class="flex justify-between items-center">
      <h1 class="py-8 px-4 font-bold text-[24px]">Live analytics</h1>
      <div class="p-4">
        <Filter
          title="Select live stream"
          :options="sortByTime"
          @change="handleSortTimeChange"
          class="flex-1"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[5fr_5fr] gap-8 p-2">
      <!-- Col 1 -->

      <div class="bg-white shadow-lg p-6 rounded-md space-y-6">
        <div class="space-y-2">
          <div class="text-xs text-[#666666] uppercase">Title of live stream</div>
          <div class="text-base font-bold">Lorem ipsum dolor sit amet, consetetur</div>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Views</span>
            <span class="text-sm">15,519</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">avg. view time</span>
            <span class="text-sm">20:14</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Ratings</span>
            <div class="flex items-center">
              <span class="text-sm">4.5</span>
              <rate class="ml-1 mb-1" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Went LIVE on</span>
            <div class="flex items-center">
              <span class="text-sm">13 Aug 2020 • 11.53am - 12.00 pm</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Col 2  -->
      <div class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 w-full">
          <StatsCard
            v-for="(stat, index) in overviewStats"
            :key="index"
            :title="stat.title"
            :value="stat.value"
            :percent="stat.percent"
          />
        </div>
      </div>
    </div>
    <div class="pt-8">
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
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
<style></style>
