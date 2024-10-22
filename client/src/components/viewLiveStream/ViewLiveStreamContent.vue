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
  const videoData = {
    title: 'Hướng Dẫn Làm Bánh',
    ratings: 4.5,
    viewCount: 1500,
    category: {
      title: 'Nấu Ăn',
    },
    levelWorkout: {
      levelWorkout: 'Dễ',
    },
    duration: 3600,
  };
  const channelDetails = {
    avatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Streamer Channel',
    isLive: true,
    popularCheck: true,
    totalFollower: 1500,
    isChannelFollowed: false,
  };
</script>
<template>
  <div class="flex"><LiveStreamScreen /></div>
  <div class="container py-6">
    <OfflineTitle :video="videoData" />
    <hr class="h-[2px] my-7 bg-gray-dark border-0" />
    <VideoDetail :channelDetails="channelDetails" :video="videoData" />
    <Tabs value="about" class="p-0">
      <TabList class="!p-0">
        <Tab value="about">About</Tab>
      </TabList>
      <TabPanels class="p-0">
        <TabPanel class="mt-3" value="about">
          <TabAbout :channelDetails="channelDetails"
        /></TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
