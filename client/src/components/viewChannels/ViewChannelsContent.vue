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

  const username = ref(route.params.username);
  const channelId = ref(null);

  const channelDetails = ref({});
  const usernameDetails = ref({});
  const avatarDetails = ref({});
  const followChannelDetails = ref({});

  const errorData = ref(null);

  const fetchChannelData = async () => {
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

  watch(
    () => route.params.username,
    async (newUsername) => {
      username.value = newUsername;
      await fetchChannelData();
      if (channelDetails.value !== null) {
        channelId.value = channelDetails.value.id;
        await fetchListFollowOfChannel(channelId.value);
      }
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
      :username="username"
      :usernameDetails="usernameDetails"
      :avatarDetails="avatarDetails"
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
