<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import Player from '@vimeo/player';
  import VideoDetail from '@/components/VideoDetail.vue';
  import OfflineTitle from '@/components/OfflineTitle.vue';
  import Divider from 'primevue/divider';
  import axiosInstance from '@/services/axios';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabAbout from '@/components/viewChannels/TabAbout.vue';
  import CommentPage from '@/components/comments/CommentPage.vue';
  import VideoCard from '@/components/VideoCard.vue';
  import { useUserStore } from '@/stores/user.store';

  const userStore = useUserStore();

  const route = useRoute();
  const vimeoPlayer = ref(null);
  const videoId = route.params.videoId;
  const video = ref(null);
  const channelDetails = ref(null);
  const totalFollower = ref(null);
  const channelId = ref(null);
  const videos = ref([]);

  const fetchAllVideo = async () => {
    try {
      const res = await axiosInstance.get('video');
      if (res.status === 200) {
        videos.value = res.data.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchVideoById = async () => {
    try {
      const res = await axiosInstance.get(`video/${videoId}`);
      if (res.status === 200) {
        video.value = res.data.data;
        channelDetails.value = {
          channelName: res.data.data.channel.channelName,
          avatar: res.data.data.channel.avatar,
          popularCheck: res.data.data.channel.popularCheck,
          isLive: res.data.data.channel.isLive,
          bio: res.data.data.channel.bio,
          followCount: res.data.data.channel.followCount,
        };
        totalFollower.value = res.data.data.channel.followCount;
        channelId.value = res.data.data.channelId;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  onMounted(() => {
    const player = new Player(vimeoPlayer.value, {
      id: videoId,
      loop: true,
      autoplay: true,
      title: false,
      byline: false,
      portrait: false,
    });
    fetchVideoById();
    fetchAllVideo();
  });
</script>
<template>
  <div class="grid grid-cols-12">
    <div class="col-span-8">
      <div ref="vimeoPlayer" class="video-player"></div>
      <div class="p-[20px]">
        <OfflineTitle v-if="video" :video="video" />
        <Divider />
        <VideoDetail
          v-if="channelDetails"
          :channelDetails="channelDetails"
          :isButtonGiftREPsVisible="true"
          :totalFollower="totalFollower"
          :channelId="channelId"
          @updateFollowers="fetchVideoById"
        />
        <Tabs value="about" class="p-0">
          <TabList class="!p-0">
            <Tab value="about">About</Tab>
          </TabList>
          <TabPanels class="p-0">
            <TabPanel value="about"
              ><TabAbout class="mt-3" v-if="channelDetails" :channelDetails="channelDetails"
            /></TabPanel>
          </TabPanels>
        </Tabs>
        <Divider />
        <CommentPage :videoId="videoId" />
      </div>
    </div>
    <div class="col-span-4">
      <div class="p-[10px]">
        <h3 class="font-bold mb-2 uppercase">watch also</h3>
        <div>
          <VideoCard
            v-if="videos"
            v-for="(video, index) in videos"
            :key="index"
            :video="video"
            :channelDetails="video.channel"
          />
        </div>
      </div>
    </div>
  </div>
</template>
