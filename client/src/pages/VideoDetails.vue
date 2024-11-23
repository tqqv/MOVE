<script setup>
  import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
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
  import Skeleton from 'primevue/skeleton';
  import TabAbout from '@/components/viewChannels/TabAbout.vue';
  import CommentPage from '@/components/comments/CommentPage.vue';
  import VideoCard from '@/components/VideoCard.vue';
  import { useUserStore } from '@/stores';

  const userStore = useUserStore();
  const { user } = userStore;
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
  const isCommentable = ref(null);
  let playerInstance = null;
  const isLoading = ref(true);
  const isVideoLoading = ref(true);
  const isWatchAlsoLoading = ref(true);
  let actualWatchTime = 0;
  let lastUpdateTime = 0;
  let hasWatchedFiveMinutes = false;
  let currentVideoId = ref(videoId.value);

  const fetchWatchAlso = async () => {
    try {
      isWatchAlsoLoading.value = true;
      const res = await axiosInstance.get(
        `video/getVideoWatchAlso?videoId=${videoId.value}&category=${categoryId.value}&levelWorkout=${levelworkoutsId.value}`,
      );
      if (res.status === 200) {
        videos.value = res.data.data;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      isWatchAlsoLoading.value = false;
    }
  };

  const fetchVideoById = async () => {
    try {
      isVideoLoading.value = true;
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
        isCommentable.value = res.data.data.isCommentable;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        router.push('/404');
      } else {
        toast.error(error.message);
      }
    } finally {
      isVideoLoading.value = false;
    }
  };

  const increaseView = async (viewTime) => {
    try {
      const res = await axiosInstance.post('video/increaseView', {
        userId: user?.id || null,
        videoId: videoId.value,
        viewTime: viewTime,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const updateViewTime = async (viewTime, videoId) => {
    if (user?.id) {
      try {
        const res = await axiosInstance.post('video/updateViewTime', {
          videoId: videoId,
          viewTime: viewTime,
        });
      } catch (error) {
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
      loop: false,
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
    playerInstance.on('timeupdate', (data) => {
      const currentTime = data.seconds;

      if (currentTime > lastUpdateTime) {
        actualWatchTime += Math.min(currentTime - lastUpdateTime, 1);
      }

      lastUpdateTime = currentTime;

      if (Math.floor(actualWatchTime) === 300 && !hasWatchedFiveMinutes) {
        hasWatchedFiveMinutes = true;
        increaseView(Math.floor(actualWatchTime));
      }
    });

    playerInstance.on('ended', () => {
      if (!hasWatchedFiveMinutes && actualWatchTime >= lastUpdateTime) {
        increaseView(Math.floor(actualWatchTime));
      }
      actualWatchTime = 0;
      lastUpdateTime = 0;
      hasWatchedFiveMinutes = false;
      playerInstance.setCurrentTime(0).then(() => {
        playerInstance.pause();
      });
    });
  };

  const handleUnload = (videoId) => {
    if (actualWatchTime >= lastUpdateTime) {
      updateViewTime(Math.floor(actualWatchTime), videoId);
    }
  };

  onMounted(async () => {
    initializePlayer();
    await fetchVideoById();
    await fetchWatchAlso();
  });

  onBeforeUnmount(() => {
    handleUnload(currentVideoId.value);
  });
  watch(videoId, async () => {
    actualWatchTime = 0;
    lastUpdateTime = 0;
    initializePlayer();
    await fetchVideoById();
    await fetchWatchAlso();
  });
  watch(videoId, (newVideoId) => {
    currentVideoId.value = newVideoId;
  });
</script>
<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 lg:col-span-9">
      <div ref="vimeoPlayer" :class="['video-player', 'relative', { 'bg-black': isLoading }]">
        <div v-if="isLoading" class="grid place-items-center absolute top-0 left-0 w-full h-full">
          <i class="pi pi-spin pi-spinner text-white text-[50px]"></i>
        </div>
      </div>
      <div class="p-[20px]">
        <div v-if="isVideoLoading">
          <div>
            <div class="flex justify-between">
              <Skeleton width="20rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem"></Skeleton>
            </div>
            <Skeleton width="15rem" class="mb-2"></Skeleton>
            <div class="flex justify-between">
              <div class="flex gap-2 items-center">
                <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
                <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
              </div>
              <div class="flex gap-4 items-center">
                <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
                <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
                <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
              </div>
            </div>
          </div>
        </div>
        <OfflineTitle
          v-else-if="video && !isVideoLoading"
          :video="video"
          @updateRate="fetchVideoById"
          titleRate="Rate Video"
        />
        <Divider />
        <div v-if="isVideoLoading">
          <div class="flex items-center justify-between">
            <div class="flex mt-4 items-center">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
              </div>
            </div>
            <div class="flex gap-4 items-center">
              <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
              <Skeleton width="5rem" height="30px" class="mb-2 rounded-xl"></Skeleton>
            </div>
          </div>
        </div>
        <VideoDetail
          v-else-if="channelDetails && !isVideoLoading"
          :channelDetails="channelDetails"
          :isButtonGiftREPsVisible="true"
          :totalFollower="totalFollower"
          :channelId="channelId"
          :usernameDetails="usernameDetails"
          @updateFollowers="fetchVideoById"
          :hiddenReport="false"
        />
        <Tabs value="about" class="p-0">
          <TabList class="!p-0">
            <div v-if="isVideoLoading" class="mt-5">
              <Skeleton width="5rem" class="mb-2"></Skeleton>
            </div>
            <Tab v-else-if="!isVideoLoading && channelDetails" value="about">About</Tab>
          </TabList>
          <TabPanels class="p-0">
            <TabPanel value="about">
              <div v-if="isVideoLoading" class="mt-3">
                <div class="grid grid-cols-10 gap-6 pt-2">
                  <div class="col-span-7">
                    <Skeleton height="75px" class="mb-2 rounded-xl"></Skeleton>
                  </div>
                  <div class="col-span-3">
                    <Skeleton height="15px" class="mb-3 rounded-xl"></Skeleton>
                    <div class="flex items-center gap-4">
                      <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
                      <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
                      <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
                    </div>
                  </div>
                </div>
              </div>
              <TabAbout
                class="mt-3"
                v-else-if="!isVideoLoading && channelDetails"
                :channelDetails="channelDetails"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Divider />
        <div v-if="isVideoLoading">
          <div class="grid grid-cols-12 items-center">
            <Skeleton shape="circle" size="4rem" class="col-span-1"></Skeleton>
            <Skeleton height="50px" class="col-span-11"></Skeleton>
          </div>
          <div class="flex gap-x-4 items-center mt-10">
            <Skeleton shape="circle" size="4rem"></Skeleton>
            <div>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <div class="flex items-center gap-4">
                <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
                <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
                <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
              </div>
            </div>
          </div>
        </div>
        <CommentPage
          v-else-if="videoId && !isVideoLoading"
          :videoId="videoId"
          :isCommentable="isCommentable"
        />
      </div>
    </div>
    <div class="col-span-12 lg:col-span-3">
      <div class="p-[10px]">
        <h3 class="font-bold mb-2 uppercase px-2 py-3">watch also</h3>
        <div v-if="isWatchAlsoLoading" class="grid gap-4 mt-3 px-2">
          <div>
            <Skeleton height="200px" />
            <div class="flex mt-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height=".5rem"></Skeleton>
              </div>
            </div>
          </div>
          <div>
            <Skeleton height="200px" />
            <div class="flex mt-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height=".5rem"></Skeleton>
              </div>
            </div>
          </div>
          <div>
            <Skeleton height="200px" />
            <div class="flex mt-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height=".5rem"></Skeleton>
              </div>
            </div>
          </div>
          <div>
            <Skeleton height="200px" />
            <div class="flex mt-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height=".5rem"></Skeleton>
              </div>
            </div>
          </div>
        </div>
        <VideoCard v-else-if="videos && !isWatchAlsoLoading" :videos="videos" />
      </div>
    </div>
  </div>
</template>
