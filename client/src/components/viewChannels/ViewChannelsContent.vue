<script setup>
  import { ref, markRaw, onMounted, watch } from 'vue';

  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabVideoList from '@components/viewChannels/TabVideoList.vue';
  import VideoDetail from '@components/VideoDetail.vue';
  import TabAbout from './TabAbout.vue';
  import { useRoute } from 'vue-router';
  import { getViewChannel } from '@/services/streamer';
  import { getProfilebyUsername } from '@/services/user';

  import { getListFollowOfChannel } from '@/services/streamer';
  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideoList), value: '0' },
    { title: 'About', component: markRaw(TabAbout), value: '1' },
  ]);
  const route = useRoute();

  const username = ref(route.params.username);
  const channelId = ref(null);

  const channelDetails = ref({});
  const userDetails = ref({});
  const followChannelDetails = ref({});

  const totalFollower = ref(null);
  const errorData = ref(null);
  // const fetchUserData = async () => {
  //   const result = await getProfilebyUsername(username.value);

  //   if (result.error) {
  //     errorData.value = result.message;
  //   } else {
  //     userDetails.value = result.data.profile;
  //   }
  // };
  const fetchChannelData = async () => {
    const result = await getViewChannel(username.value);

    if (result.error) {
      errorData.value = result.message;
    } else {
      channelDetails.value = result.data.profile;
      totalFollower.value = result.data.totalFollower;
      channelId.value = result.data.profile.id;
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

  onMounted(async () => {
    await fetchChannelData();
    await fetchUserData();
    await fetchListFollowOfChannel(channelId.value);
  });

  watch(
    () => route.params.username,
    async (newUsername) => {
      username.value = newUsername;
      await fetchChannelData();
      await fetchListFollowOfChannel(channelId.value);
    },
  );
</script>

<template>
  <section class="px-10 flex-grow">
    <VideoDetail
      :is-user-action="true"
      :is-button-gift-r-e-ps-visible="true"
      :channelDetails="channelDetails"
      :channelId="channelId"
      :totalFollower="totalFollower"
      :username="username"
      @updateFollowers="fetchChannelData"
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
                v-if="channelId"
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
