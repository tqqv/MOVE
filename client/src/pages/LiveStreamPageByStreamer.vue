<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  import { useUserStore } from '@/stores';
  import { joinRoom, listenStreamReady } from '@/services/socketService';

  const userStore = useUserStore();
  const statusLive = ref('inLive');
  const connectOBS = ref(false);
  const time = ref(0);
  let timer = null;

  const updateStatusLive = (value) => {
    statusLive.value = value;
  };

  const handleConnectOBS = () => {
    if (userStore.user?.Channel?.id) {
      joinRoom(userStore.user.Channel.id);

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

  const handleEndLive = () => {
    clearInterval(timer);
    statusLive.value = 'offline';
  };

  onMounted(() => {
    if (statusLive.value === 'inLive') startTimer();
  });
  onUnmounted(() => clearInterval(timer));

  onMounted(async () => {
    await userStore.fetchUserProfile();
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
