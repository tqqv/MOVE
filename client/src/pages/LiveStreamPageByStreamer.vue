<script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  import { useStreamerStore, useUserStore } from '@/stores';
  import { joinRoom, listenStreamReady } from '@/services/socketService';

  const streamerStore = useStreamerStore();
  const connectOBS = ref(null);
  const liveStatus = ref(null);

  const time = ref(0);
  let timer = null;

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

  const startTimer = () => {
    timer = setInterval(() => {
      time.value += 1;
    }, 1000);
  };

  onUnmounted(() => clearInterval(timer));

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    handleConnectOBS();
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
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] bg-[#f0f2f5]">
    <SideBarLive :time="time" :connectOBS="connectOBS" :liveStatus="liveStatus" />
    <div class="flex-1 overflow-y-auto">
      <router-view :connectOBS="connectOBS" :liveStatus="liveStatus" />
    </div>
  </div>
</template>
