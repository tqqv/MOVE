<script setup>
  import { ref, markRaw, onMounted } from 'vue';

  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabVideoList from '@components/viewChannels/TabVideoList.vue';
  import VideoDetail from '@components/VideoDetail.vue';
  import TabAbout from './TabAbout.vue';
  import MMAImage from '@/assets/category/MMA.png';
  import { getViewChannel } from '@/services/user';
  import { getListFollowOfChannel } from '@/services/streamer';
  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideoList), value: '0' },
    { title: 'About', component: markRaw(TabAbout), value: '1' },
  ]);
  const username = ref('channelHoang'); // Thay thế bằng username thực tế bạn muốn lấy
  const channelId = ref(3);
  const channelDetails = ref({});
  const followChannelDetails = ref({});

  const totalFollower = ref(null);
  const errorData = ref(null);

  const fetchChannelData = async () => {
    const result = await getViewChannel(username.value);
    console.log(result.data.profile);

    if (result.error) {
      errorData.value = result.data.profile;
    } else {
      channelDetails.value = result.data.profile;
      totalFollower.value = result.data.totalFollower;
      console.log(channelDetails.value);
    }
  };
  const fetchListFollowOfChannel = async (channelId) => {
    const result = await getListFollowOfChannel(channelId);

    if (result.error) {
      errorData.value = result.message || 'Error occurred';
    } else if (result.data && result.data.length > 0) {
      followChannelDetails.value = result.data.map((item) => item.followChannel);
    } else {
      followChannelDetails.value = [];
    }
  };

  onMounted(() => {
    fetchChannelData();
    fetchListFollowOfChannel(channelId.value);
    console.log(channelDetails);
  });
</script>

<template>
  <section class="px-10 flex-grow mr-14">
    <VideoDetail
      :is-user-action="true"
      :is-button-gift-r-e-ps-visible="true"
      :channelDetails="channelDetails"
      :totalFollower="totalFollower"
      class="pl-3"
    />
    <div>
      <div class="mt-2">
        <Tabs value="0">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
              <component
                :is="tab.component"
                :channelDetails="channelDetails"
                :channelId="channelId"
                :followChannelDetails="followChannelDetails"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    <div></div>
  </section>
</template>

<style></style>
