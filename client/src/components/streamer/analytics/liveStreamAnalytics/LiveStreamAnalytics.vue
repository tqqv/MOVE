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
  import rate from '@components/icons/rate.vue';
  import { formatView, formatRating, formatDatePosted, formatAvgViewTime } from '@/utils';
  import TabAge from '@components/streamer/analytics/videoAnalytics/TabAge.vue';
  import TabCountry from '@components/streamer/analytics/videoAnalytics/TabCountry.vue';
  import Filter from '@/components/Filter.vue';
  import { getAllLivestreamSession, getLiveStreamAnalytics } from '@/services/liveStream';

  const liveStreamDetails = ref([{}]);
  const page = ref(1);
  const pageSize = ref(100);
  const overviewStats = [
    { title: 'Total REPs earned' },
    { title: 'New followers' },
    { title: 'Number of shares' },
    { title: 'Highest View Peak ' },
  ];

  const selectedLiveStreamSession = ref(null);

  const liveStreamSession = ref([{}]);
  const scrollableTabs = [
    { title: 'Gender', value: '0', component: TabGender },
    { title: 'Age', value: '1', component: TabAge },
    { title: 'Country', value: '2', component: TabCountry },
  ];

  const tabStore = useTabStore();
  const onTabChange = (event) => {
    tabStore.setActiveTab(event.value);
  };

  const activeTab = computed(() => tabStore.activeTab);

  const fetchAllLivestreamSession = async () => {
    try {
      const response = await getAllLivestreamSession(page.value, pageSize.value);
      liveStreamSession.value = response.data.data.listLivestream.rows;
      selectedLiveStreamSession.value = response.data.data.listLivestream.rows[0];
    } catch (error) {
      log.error(error.message);
    }
  };

  const handleSortTimeChange = (newValue) => {
    selectedLiveStreamSession.value = newValue || '';
  };

  const fetchLiveStreamAnalytics = async () => {
    try {
      const response = await getLiveStreamAnalytics(selectedLiveStreamSession.value.id);

      liveStreamDetails.value = response.data.data.livestream;
      overviewStats[0].value = response.data.data.livestream.repsEarned;
      overviewStats[1].value = response.data.data.newFollowers;
      overviewStats[2].value = response.data.data.livestream.totalShare;
      overviewStats[3].value = response.data.data.livestream.highestViewAtSameTime;
    } catch (error) {
      log.error(error.message);
    }
  };
  watch(selectedLiveStreamSession, (newValue) => {
    if (newValue && newValue.id) {
      fetchLiveStreamAnalytics(newValue.id);
    } else {
      console.warn('Selected session is undefined or missing an ID.');
    }
  });

  onMounted(async () => {
    await fetchAllLivestreamSession();
  });
</script>
<template>
  <div class="container">
    <div class="flex justify-between items-center">
      <h1 class="py-8 px-4 font-bold text-[24px]">Live analytics</h1>
      <div class="p-4 w-[30%]">
        <Filter
          title="Select live stream"
          :options="liveStreamSession"
          @change="handleSortTimeChange"
          class="flex-1"
          optionLabel="timeLive"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[5fr_5fr] gap-8 p-2">
      <!-- Col 1 -->

      <div class="bg-white shadow-lg p-6 rounded-md space-y-6">
        <div class="space-y-2">
          <div class="text-xs text-[#666666] uppercase">Title of live stream</div>
          <div class="text-base font-bold">{{ liveStreamDetails.title }}</div>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Views</span>
            <span class="text-sm">{{ formatView(liveStreamDetails.totalView) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">avg. view time</span>
            <span class="text-sm">NULL</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Ratings</span>
            <div class="flex items-center">
              <span class="text-sm">{{ formatRating(liveStreamDetails.ratings) }}</span>
              <rate class="ml-1 mb-1" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Went LIVE on</span>
            <div class="flex items-center">
              <span class="text-sm">{{ selectedLiveStreamSession?.timeLive }}</span>
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
