<script setup>
  import { useRoute } from 'vue-router';
  import LogoIcon from '../icons/logoIcon.vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import {
    disconnectLivestream,
    joinRoom,
    listenChatHistory,
    listenNewMessage,
  } from '@/services/socketService';
  import { useUserStore } from '@/stores';

  const route = useRoute();
  const userStore = useUserStore();

  const chatMessages = ref([]);
  const listDonation = ref([]);
  const liveStreamData = {
    streamer: route.params.channelId,
    type: route.query.type,
  };
  const joinLiveRoom = () => {
    if (liveStreamData.streamer) {
      console.log(`Joining room: ${liveStreamData.streamer}`);
      joinRoom(liveStreamData.streamer);
    }
  };

  onUnmounted(async () => {
    disconnectLivestream();
  });

  const fetchChat = () => {
    listenChatHistory((chatHistory) => {
      chatMessages.value = chatHistory;
    });
  };
  const fetchNewChat = () => {
    listenNewMessage((newMessage) => {
      if (newMessage.donation) {
        listDonation.value.push(newMessage);
      }
      chatMessages.value.push(newMessage);
    });
  };
  onMounted(() => {
    joinLiveRoom();
    fetchChat();
    fetchNewChat();
  });
</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-transparent">
    <router-view :listDonation="listDonation" :chatMessages="chatMessages" />
  </div>
</template>
