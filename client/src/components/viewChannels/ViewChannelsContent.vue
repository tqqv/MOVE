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
  import { useRoute, useRouter } from 'vue-router';
  import { getProfilebyUsername } from '@/services/user';
  import { useUserStore } from '@/stores/user.store';

  import { getListFollowOfChannel } from '@/services/streamer';
  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideoList), value: '0' },
    { title: 'About', component: markRaw(TabAbout), value: '1' },
  ]);
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const activeTab = ref('0');
  const username = ref(route.params.username);
  const channelId = ref(null);

  const channelDetails = ref({});
  const usernameDetails = ref({});
  const avatarDetails = ref({});
  const followChannelDetails = ref({});
  const loading = ref(true);
  const errorData = ref(null);

  const fetchChannelData = async () => {
    loading.value = true;
    try {
      const result = await getProfilebyUsername(username.value);
      if (result.error) {
        errorData.value = result.message;
        router.push('/404');
      } else {
        channelDetails.value = result.data.Channel;
        usernameDetails.value = result.data.username;
        avatarDetails.value = result.data.avatar;
        if (channelDetails.value !== null) {
          channelId.value = result.data.Channel.id;
        }
      }
    } catch (error) {
      console.error('Error fetching channel data:', error);
      errorData.value = 'An unexpected error occurred.';
    } finally {
      loading.value = false;
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
    if (channelDetails.value !== null) {
      channelId.value = channelDetails.value.id;
      await fetchListFollowOfChannel(channelId.value);
    }
  });
  const handleResetActiveTab = (newTab) => {
    activeTab.value = newTab;
  };
  watch(
    () => route.params.username,
    async (newUsername) => {
      username.value = newUsername;
      activeTab.value = '0';
      await fetchChannelData();
      if (channelDetails.value !== null) {
        channelId.value = channelDetails.value.id;
        await fetchListFollowOfChannel(channelId.value);
      }
    },
  );
  const onTabChange = (event) => {
    activeTab.value = event;
  };
</script>

<template>
  <section class="px-10 flex-grow">
    <VideoDetail
      :is-user-action="true"
      :is-button-gift-r-e-ps-visible="true"
      :channelDetails="channelDetails"
      :channelId="channelId"
      :username="username"
      :usernameDetails="usernameDetails"
      :avatarDetails="avatarDetails"
      @updateFollowers="fetchChannelData"
      :hiddenReport="true"
      class="pl-3"
      isGiftVisivle="false"
      :loading="loading"
    />
    <div>
      <div class="mt-2">
        <Tabs :value="activeTab" @update:value="onTabChange">
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
                :usernameDetails="usernameDetails"
                @handleResetActiveTab="handleResetActiveTab"
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
