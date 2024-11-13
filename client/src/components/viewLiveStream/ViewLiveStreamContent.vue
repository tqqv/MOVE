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
  import { onMounted, watch } from 'vue';

  const props = defineProps({
    username: String,
    connectOBS: String,
    liveStatus: String,
    liveStreamData: Array,
  });

  onMounted(() => {
    console.log(props.liveStreamData.livestream);
  });
</script>
<template>
  <div class="flex">
    <LiveStreamScreen
      v-if="
        props.connectOBS === 'streamPublished' || (props.liveStatus && props.connectOBS == null)
      "
      :username="username"
    />
    <NoneLiveStream
      v-if="
        props.connectOBS === 'streamEnded' ||
        props.connectOBS === 'streamReady' ||
        props.connectOBS === 'null' ||
        (props.connectOBS == null && !props.liveStatus)
      "
    />
  </div>
  <div class="container py-6">
    <OfflineTitle
      :livestream="props.liveStreamData?.livestream"
      titleRate="Rate Stream"
      reportType="stream"
    />
    <hr class="h-[2px] my-7 bg-gray-dark border-0" />
    <VideoDetail
      v-if="props.liveStreamData.channel"
      :channelDetails="props.liveStreamData?.channel"
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
