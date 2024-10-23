<script setup>
  import { computed, onMounted, ref } from 'vue';
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
  import { formatView, formatRating, formatDatePosted, formatAvgViewTime } from '@/utils';
  import TabAge from './TabAge.vue';
  import TabCountry from './TabCountry.vue';

  const route = useRoute();
  const videoId = route.params.videoId;
  const videosDetails = ref([{}]);
  const viewersData = ref([]);

  const overviewStats = [{ title: 'Total REPs earned' }, { title: 'Number of shares' }];
  const genderStats = [{}];
  const ageStats = ref(null);
  const countryStats = ref(null);

  const scrollableTabs = [
    { title: 'Gender', value: '0', component: TabGender },
    { title: 'Age', value: '1', component: TabAge },
    { title: 'Nationality', value: '2', component: TabCountry },
    { title: 'Country', value: '3', component: TabCountry },
  ];
  const tabStore = useTabStore();
  const onTabChange = (event) => {
    tabStore.setActiveTab(event.value);
  };
  const activeTab = computed(() => tabStore.activeTab);

  const fetchVideosAnalytics = async (videoId) => {
    try {
      const response = await getVideoAnalyticsById(videoId);
      videosDetails.value = response.data.videoData;
      console.log(videosDetails.value);

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

  onMounted(() => {
    fetchVideosAnalytics(videoId);
    console.log(overviewStats);
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
      <div class="flex gap-8">
        <!-- <Filter title="SHOW" :options="sortByTime" @change="handleSortTimeChange" class="flex-1" /> -->
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 p-4">
      <!-- Col 1 -->

      <div class="space-y-12">
        <div class="space-y-4">
          <div>
            <img
              :src="videosDetails.thumbnailUrl"
              class="rounded-lg object-cover w-full h-[200px]"
            />
          </div>

          <div>
            <div class="text-base font-bold">{{ videosDetails.title }}</div>
            <div class="text-[#666666] text-sm">{{ videosDetails.category?.title }}</div>
          </div>
          <div class="pt-6 space-y-4">
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
      </div>

      <!-- Col 2  -->
      <div class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-2/3 pl-4">
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
          <Tabs :value="activeTab" @tab-change="onTabChange" scrollable class="mb-4">
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
    </div>
  </div>
</template>
