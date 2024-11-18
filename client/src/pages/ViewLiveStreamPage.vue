<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import LiveChat from '@/components/LiveChat.vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ViewLiveStreamContent from '@/components/viewLiveStream/ViewLiveStreamContent.vue';
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { fetchViewLiveStreamByUsername } from '@/services/liveStream';
  import {
    disconnectLivestream,
    joinRoom,
    listenChatHistory,
    listenStreamMetrics,
    listenStreamReady,
  } from '@/services/socketService';

  const route = useRoute();
  const router = useRouter();
  const connectOBS = ref(null);
  const liveStatus = ref(null);
  const username = route.params.username;
  const liveStreamData = ref([]);
  const metricsData = ref([]);
  const fetchUserViewLive = async (username) => {
    try {
      const response = await fetchViewLiveStreamByUsername(username);
      if (!response.success) {
        router.push('/404');
      } else {
        liveStreamData.value = response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinLiveRoom = () => {
    if (liveStreamData.value?.channel?.id) {
      joinRoom(liveStreamData.value?.channel?.id);
      listenStreamReady((isReady) => {
        // console.log('Received streamReady:', isReady);
        connectOBS.value = isReady;
        fetchUserViewLive(username);
      });

      listenStreamMetrics((metrics) => {
        metricsData.value = metrics;
        // console.log('Stream Metrics:', metrics);
      });
    }
  };

  onMounted(async () => {
    await fetchUserViewLive(username);
    joinLiveRoom();
  });

  onUnmounted(async () => {
    disconnectLivestream();
  });

  watch(
    () => liveStreamData.value?.channel?.isLive,
    async (newLiveStatus) => {
      liveStatus.value = newLiveStatus;
    },
  );
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px]">
    <SideBarFollow />
    <div class="flex-1 overflow-y-auto overflow-x-none mb-4">
      <ViewLiveStreamContent
        :connectOBS="connectOBS"
        :liveStatus="liveStatus"
        :username="username"
        :liveStreamData="liveStreamData"
        :metricsData="metricsData"
      />
    </div>
    <LiveChat :liveStreamData="liveStreamData.channel?.id" />
  </div>
</template>
