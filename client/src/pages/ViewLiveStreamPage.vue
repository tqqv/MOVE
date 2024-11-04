<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import LiveChat from '@/components/LiveChat.vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ViewLiveStreamContent from '@/components/viewLiveStream/ViewLiveStreamContent.vue';
  import { onMounted, ref, watch } from 'vue';
  import { fetchViewLiveStreamByUsername } from '@/services/liveStream';
  import { joinRoom, listenStreamReady } from '@/services/socketService';
  import { connect } from 'socket.io-client';

  const route = useRoute();
  const router = useRouter();
  const connectOBS = ref(null);
  const liveStatus = ref(null);
  const username = route.params.username;
  const liveStreamData = ref([]);

  const fetchUserViewLive = async (username) => {
    try {
      const response = await fetchViewLiveStreamByUsername(username);
      if (!response.data?.channel?.isLive) {
        router.push(`/user/${username}`);
      }
      liveStreamData.value = response.data;
      console.log(liveStreamData.value);
    } catch (error) {
      console.log(error);
    }
  };

  const joinLiveRoom = () => {
    if (liveStreamData.value?.channel?.id) {
      joinRoom(liveStreamData.value?.channel?.id);
      listenStreamReady((isReady) => {
        fetchUserViewLive(username);
        connectOBS.value = isReady;
      });
    }
  };

  onMounted(async () => {
    await fetchUserViewLive(username);
    joinLiveRoom();
  });

  watch(
    () => liveStreamData.value?.channel?.isLive,
    async (newLiveStatus) => {
      liveStatus.value = newLiveStatus;
    },
  );

  watch(() => {
    console.log('Connectobs : ', connectOBS.value);
    console.log('LiveServer : ', liveStatus.value);
  });
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
      />
    </div>
    <LiveChat />
  </div>
</template>
