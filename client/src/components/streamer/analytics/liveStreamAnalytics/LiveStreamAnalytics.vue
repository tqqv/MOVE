<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabGender from '@components/streamer/analytics/TabGender.vue';
  import { useTabStore } from '@/stores/tab.store';
  import rate from '@components/icons/rate.vue';
  import { formatView, formatRating, formatAvgViewTime, truncateDescripton } from '@/utils';
  import TabAge from '@components/streamer/analytics//TabAge.vue';
  import TabCountry from '@components/streamer/analytics/liveStreamAnalytics/TabCountry.vue';
  import Filter from '@/components/Filter.vue';
  import { getAllLivestreamSession, getLiveStreamAnalytics } from '@/services/liveStream';
  import Skeleton from 'primevue/skeleton';

  const liveStreamDetails = ref([{}]);
  const page = ref(1);
  const pageSize = ref(200);
  const ageStats = ref(null);
  const genderStats = ref(null);
  const dataByIp = ref(null);
  const isLoadingLive = ref(false);
  const liveStreamId = ref(null);
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
    isLoadingLive.value = true;
    try {
      const response = await getLiveStreamAnalytics(selectedLiveStreamSession.value.id);

      liveStreamDetails.value = response.data.data.livestream;
      overviewStats[0].value = response.data.data.livestream.repsEarned;
      overviewStats[1].value = response.data.data.newFollowers;
      overviewStats[2].value = response.data.data.livestream.totalShare;
      overviewStats[3].value = response.data.data.livestream.highestViewAtSameTime;
      ageStats.value = response.data.data.data.ageData;
      genderStats.value = response.data.data.data.genderData;
      dataByIp.value = response.data.data.data.dataByIp;

      liveStreamId.value = response.data.data.livestream.id;
    } catch (error) {
      log.error(error.message);
    } finally {
      isLoadingLive.value = false;
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
          @fetchAllLivestreamSession="fetchAllLivestreamSession"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[5fr_5fr] gap-8 p-2">
      <!-- Col 1 -->
      <Skeleton v-if="isLoadingLive" width="100%" height="315px"></Skeleton>

      <div v-else class="bg-white shadow-lg p-6 rounded-md space-y-6">
        <div class="space-y-2">
          <div class="text-xs text-[#666666] uppercase">Title of live stream</div>
          <div class="text-base font-bold" :title="liveStreamDetails.title">
            {{ truncateDescripton(liveStreamDetails.title, 40) }}
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">Views</span>
            <span class="text-sm">{{ formatView(liveStreamDetails.totalView) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-[#666666] uppercase">avg. view time</span>
            <span class="text-sm">{{ formatAvgViewTime(liveStreamDetails.avgView) }}</span>
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
            :isLoading="isLoadingLive"
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
              :is="tab.component"
              :genderStats="genderStats"
              :totalViewer="liveStreamDetails.totalViewer"
              :ageStats="ageStats"
              :dataByIp="dataByIp"
              :liveStreamId="liveStreamId"
              :isLoading="isLoadingLive"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
<style></style>
