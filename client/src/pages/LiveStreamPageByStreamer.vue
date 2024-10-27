<script setup>
  import { onMounted, ref } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  import { useUserStore } from '@/stores';
  import { joinRoom, listenStreamReady } from '@/services/socketService';

  const userStore = useUserStore();
  const statusLive = ref('beforeLive');
  const connectOBS = ref(false);
  const updateStatusLive = (value) => {
    statusLive.value = value;
  };

  const handleConnectOBS = () => {
    joinRoom(userStore.user.Channel.id);

    listenStreamReady((isReady) => {
      connectOBS.value = isReady;
    });
  };

  onMounted(async () => {
    await userStore.fetchUserProfile();
    await handleConnectOBS();
  });
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] bg-[#f0f2f5]">
    <SideBarLive
      :connectOBS="connectOBS"
      :statusLive="statusLive"
      @updateStatusLive="updateStatusLive"
    />
    <div class="flex-1 overflow-y-auto">
      <router-view :statusLive="statusLive" :connectOBS="connectOBS" />
    </div>
  </div>
</template>
