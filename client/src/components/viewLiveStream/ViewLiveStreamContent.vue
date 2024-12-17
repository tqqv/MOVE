<script setup>
  import TabList from 'primevue/tablist';
  import LiveStreamScreen from '../LiveStreamScreen.vue';
  import OfflineTitle from '../OfflineTitle.vue';
  import VideoDetail from '../VideoDetail.vue';
  import TabAbout from '../viewChannels/TabAbout.vue';
  import Tabs from 'primevue/tabs';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import NoneLiveStream from './NoneLiveStream.vue';

  const props = defineProps({
    username: String,
    connectOBS: String,
    liveStatus: Boolean,
    liveStreamData: Object,
    metricsData: Object,
    listDonation: Array,
  });
</script>
<template>
  <LiveStreamScreen
    v-if="props.connectOBS === 'streamPublished' || (props.liveStatus && props.connectOBS == null)"
    :username="username"
  />

  <!-- <ViewReupLive  /> -->
  <NoneLiveStream
    v-if="
      props.connectOBS === 'streamEnded' ||
      props.connectOBS === 'streamReady' ||
      props.connectOBS === 'null' ||
      (props.connectOBS == null && !props.liveStatus)
    "
  />
  <div class="container p-[20px]">
    <OfflineTitle
      v-if="props.liveStreamData?.livestream"
      :livestream="props.liveStreamData?.livestream"
      :metricsData="props.metricsData"
      titleRate="Rate Stream"
      reportType="stream"
    />
    <hr v-if="props.liveStreamData?.livestream" class="h-[2px] my-7 bg-gray-dark border-0" />
    <VideoDetail
      v-if="props.liveStreamData.channel"
      :channelDetails="props.liveStreamData?.channel"
      :usernameDetails="props.liveStreamData?.channel?.User?.username"
      :channelId="props.liveStreamData?.channel?.id"
      :liveStreamData="props.liveStreamData"
      :listDonation="props.listDonation"
      :isGiftVisible="true"
      :isStreamPage="true"
    />
    <Tabs value="about" class="p-0">
      <TabList class="!p-0">
        <Tab value="about">About</Tab>
      </TabList>
      <TabPanels class="p-0">
        <TabPanel class="mt-3" value="about">
          <TabAbout
            v-if="props.liveStreamData.channel"
            :channelDetails="props.liveStreamData?.channel"
        /></TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
