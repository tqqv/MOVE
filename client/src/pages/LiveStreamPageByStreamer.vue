<script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  import { useStreamerStore, useUserStore } from '@/stores';
  import { joinRoom, listenStreamReady } from '@/services/socketService';

  const streamerStore = useStreamerStore();
  const statusLive = ref('beforeLive');
  const connectOBS = ref(false);
  const time = ref(0);
  let timer = null;

  const updateStatusLive = (value) => {
    statusLive.value = value;
  };

  const handleConnectOBS = () => {
    if (streamerStore.streamerChannel?.id) {
      joinRoom(streamerStore.streamerChannel.id);

      listenStreamReady((isReady) => {
        connectOBS.value = isReady;
      });
    }
  };

  const startTimer = () => {
    timer = setInterval(() => {
      time.value += 1;
    }, 1000);
  };

  watch(statusLive, (newStatus) => {
    if (newStatus === 'inLive') {
      startTimer();
    } else {
      clearInterval(timer);
      time.value = 0;
    }
  });
  onUnmounted(() => clearInterval(timer));

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    handleConnectOBS();
  });
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] bg-[#f0f2f5]">
    <SideBarLive
      :time="time"
      :connectOBS="connectOBS"
      :statusLive="statusLive"
      @updateStatusLive="updateStatusLive"
      @handleEndLive="handleEndLive"
    />
    <div class="flex-1 overflow-y-auto">
      <router-view :statusLive="statusLive" :connectOBS="connectOBS" />
    </div>
  </div>
</template>
