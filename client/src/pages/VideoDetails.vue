<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import Player from '@vimeo/player';
  import VideoDetail from '@/components/VideoDetail.vue';
  import OfflineTitle from '@/components/OfflineTitle.vue';
  import Divider from 'primevue/divider';
  import axiosInstance from '@/services/axios';

  const route = useRoute();
  const vimeoPlayer = ref(null);
  const videoId = route.params.videoId;
  const video = ref(null);
  const videoDetails = ref(null);

  const fetchVideoById = async () => {
    try {
      const res = await axiosInstance.get(`video/${videoId}`);
      if (res.status === 200) {
        video.value = res.data.data;
        console.log(res);
        videoDetails.value = {
          name: res.data.data.channel.channelName,
          avatar: res.data.data.channel.avatar,
          followers: res.data.data.channel.followCount,
          status: 'Online',
          isVerified: true,
          isLive: res.data.data.channel.isLive,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  onMounted(() => {
    const player = new Player(vimeoPlayer.value, {
      id: videoId,
      loop: false,
      autoplay: true,
      title: false,
      byline: false,
      portrait: false,
    });
    fetchVideoById();
  });
</script>
<template>
  <div class="grid grid-cols-12">
    <div class="col-span-8">
      <div ref="vimeoPlayer" class="video-player"></div>
      <div class="p-[10px]">
        <OfflineTitle v-if="video" :video="video" />
        <Divider />
        <VideoDetail
          v-if="videoDetails"
          :videoDetails="videoDetails"
          :isButtonGiftREPsVisible="true"
        />
      </div>
    </div>
    <div class="col-span-4">
      <div class="p-[10px]">
        <h3 class="font-bold">WATCH ALSO</h3>
      </div>
    </div>
  </div>
</template>
