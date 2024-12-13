<script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  import { useLiveStreamStore, useStreamerStore, useUserStore } from '@/stores';
  import {
    disconnectLivestream,
    joinRoom,
    listenStreamMetrics,
    listenStreamReady,
  } from '@/services/socketService';
  import { useRoute } from 'vue-router';
  import ScrollWrapper from '@/layouts/ScrollWrapper.vue';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  const route = useRoute();
  const streamerStore = useStreamerStore();
  const liveStreamStore = useLiveStreamStore();
  const connectOBS = ref(null);
  const liveStatus = ref(null);
  const metricsData = ref(null);
  // TIME START STREAM
  dayjs.extend(utc);
  const elapsedTime = ref(0);
  let timer;

  const startTimer = () => {
    const createdAt = dayjs(liveStreamStore.liveStreamData.createdAt).utc();
    if (!createdAt.isValid()) return;

    timer = setInterval(() => {
      const currentTime = dayjs().utc();
      const diffInSeconds = Math.floor(currentTime.diff(createdAt, 'second'));

      if (diffInSeconds > 0) {
        elapsedTime.value = diffInSeconds;
      }
    }, 1000);
  };
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    elapsedTime.value = 0;
  };

  // CONNECT OBS
  const handleConnectOBS = async () => {
    if (!streamerStore.streamerChannel?.id) {
      await streamerStore.fetchProfileChannel();
    }
    if (streamerStore.streamerChannel?.id) {
      joinRoom(streamerStore.streamerChannel.id);
      listenStreamReady((isReady) => {
        streamerStore.fetchProfileChannel();
        connectOBS.value = isReady;
      });

      listenStreamMetrics((metrics) => {
        metricsData.value = metrics;
      });
    }
  };

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    handleConnectOBS();
  });

  onUnmounted(async () => {
    disconnectLivestream();
  });

  watch(
    () => streamerStore.streamerChannel,
    async (newChannel) => {
      const newLiveStatus = newChannel?.liveStatus;
      if (newLiveStatus) {
        liveStatus.value = newLiveStatus;
        if (newLiveStatus === 'streamPublished') {
          try {
            const username = newChannel?.User?.username;
            if (username) {
              await liveStreamStore.fetchLiveStreamData(username);
              if (
                liveStatus.value === 'streamPublished' &&
                liveStreamStore.liveStreamData?.createdAt
              ) {
                startTimer();
              }
            }
          } catch (error) {
            console.error('Error fetching live stream data:', error);
          }
        }
      }
    },
    { deep: true },
  );

  watch(() => {
    console.log('livestatus: ', liveStatus.value);
    console.log('connectobs: ', connectOBS.value);
  });
  watch(
    () => streamerStore.streamerChannel?.User?.username,
    (newUsername) => {
      if (newUsername) {
        return newUsername;
      }
    },
  );

  // Re-fetch data when route changes
  watch(
    () => route.fullPath,
    async (newPath, oldPath) => {
      if (oldPath.includes('stream-setup')) {
        disconnectLivestream();
      }

      if (newPath.includes('dashboard-live')) {
        await streamerStore.fetchProfileChannel();
        handleConnectOBS();
      }
    },
  );
</script>

<template>
  <Navbar />
  <div class="flex pt-[64px] bg-[#f0f2f5] h-screen">
    <SideBarLive
      :elapsedTime="elapsedTime"
      :connectOBS="connectOBS"
      :liveStatus="liveStatus"
      @startTimer="startTimer"
      @stopTimer="stopTimer"
    />
    <ScrollWrapper>
      <router-view
        :elapsedTime="elapsedTime"
        :connectOBS="connectOBS"
        :liveStatus="liveStatus"
        :metricsData="metricsData"
      />
    </ScrollWrapper>
  </div>
</template>
