<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue3-toastify';
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

  const route = useRoute();
  const router = useRouter();
  const vimeoPlayer = ref(null);
  const videoId = computed(() => route.params.videoId);
  const video = ref(null);
  const channelDetails = ref(null);
  const totalFollower = ref(null);
  const channelId = ref(null);
  const categoryId = ref(null);
  const levelworkoutsId = ref(null);
  const usernameDetails = ref(null);
  const videos = ref([]);
  let playerInstance = null;
  const isLoading = ref(true);

  const fetchWatchAlso = async () => {
    try {
      const res = await axiosInstance.get(
        `video/getVideoWatchAlso?videoId=${videoId.value}&category=${categoryId.value}&levelWorkout=${levelworkoutsId.value}`,
      );
      if (res.status === 200) {
        videos.value = res.data.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchVideoById = async () => {
    try {
      const res = await axiosInstance.get(`video/${videoId.value}`);
      if (res.status === 200) {
        video.value = res.data.data;
        categoryId.value = res.data.data.categoryId;
        levelworkoutsId.value = res.data.data.levelWorkoutsId;
        usernameDetails.value = res.data.data.channel.User.username;
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
      if (error.response && error.response.status === 404) {
        router.push('/404');
      } else {
        toast.error(error.message);
      }
    }
  };

  const initializePlayer = () => {
    if (playerInstance) {
      playerInstance.destroy();
    }

    playerInstance = new Player(vimeoPlayer.value, {
      id: videoId.value,
      loop: true,
      autoplay: true,
      title: false,
      byline: false,
      portrait: false,
    });
    playerInstance.ready().catch((error) => {
      isLoading.value = true;
    });

    playerInstance.on('play', () => {
      isLoading.value = false;
    });
    playerInstance.on('loaded', () => {
      isLoading.value = false;
    });
  };

  onMounted(async () => {
    initializePlayer();
    await fetchVideoById();
    await fetchWatchAlso();
  });

  watch(videoId, async () => {
    initializePlayer();
    await fetchVideoById();
    await fetchWatchAlso();
  });

  watch(isLoading, () => {
    console.log(isLoading.value);
  });
</script>
<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 lg:col-span-8">
      <div ref="vimeoPlayer" :class="['video-player', 'relative', { 'bg-black': isLoading }]">
        <div v-if="isLoading" class="grid place-items-center absolute top-0 left-0 w-full h-full">
          <i class="pi pi-spin pi-spinner text-white text-[50px]"></i>
        </div>
      </div>
      <div class="p-[20px]">
        <OfflineTitle v-if="video" :video="video" @updateRate="fetchVideoById" />
        <Divider />
        <VideoDetail
          v-if="channelDetails"
          :channelDetails="channelDetails"
          :isButtonGiftREPsVisible="true"
          :totalFollower="totalFollower"
          :channelId="channelId"
          :usernameDetails="usernameDetails"
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
    <div class="col-span-12 lg:col-span-4">
      <div class="p-[10px]">
        <h3 class="font-bold mb-2 uppercase">watch also</h3>
        <div>
          <VideoCard v-if="videos" :videos="videos" />
        </div>
      </div>
    </div>
  </div>
</template>
