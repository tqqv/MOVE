<script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  import { useLiveStreamStore, useStreamerStore, useUserStore } from '@/stores';
  import { joinRoom, listenStreamReady } from '@/services/socketService';

  const streamerStore = useStreamerStore();
  const liveStreamStore = useLiveStreamStore();
  const connectOBS = ref(null);
  const liveStatus = ref(null);

  // TIME START STREAM
  const elapsedTime = ref(0);
  let timer;

  const startTimer = () => {
    const createdAt = new Date(liveStreamStore.liveStreamData.createdAt);
    timer = setInterval(() => {
      const currentTime = new Date();
      elapsedTime.value = Math.floor((currentTime - createdAt) / 1000);
      console.log(elapsedTime.value);
    }, 1000);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // CONNECT OBS
  const handleConnectOBS = () => {
    if (streamerStore.streamerChannel?.id) {
      joinRoom(streamerStore.streamerChannel.id);

      listenStreamReady((isReady) => {
        streamerStore.fetchProfileChannel();
        connectOBS.value = isReady;
      });
    }
  };

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    handleConnectOBS();
    if (liveStreamStore.liveStreamData?.createdAt) {
      startTimer();
    }
  });

  watch(
    () => streamerStore.streamerChannel?.liveStatus,
    (newLiveStatus) => {
      liveStatus.value = newLiveStatus;
    },
  );

  watch(() => {
    console.log('livestatus: ', liveStatus.value);
    console.log('connectobs: ', connectOBS.value);
  });
  watch(() => {
    // console.log(elapsedTime.value);
  });
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] bg-[#f0f2f5]">
    <SideBarLive
      :elapsedTime="elapsedTime"
      :connectOBS="connectOBS"
      :liveStatus="liveStatus"
      @startTimer="startTimer"
      @stopTimer="stopTimer"
    />
    <div class="flex-1 overflow-y-auto">
      <router-view :connectOBS="connectOBS" :liveStatus="liveStatus" />
    </div>
  </div>
</template>
