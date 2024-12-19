<script setup>
  import { RouterLink, useRoute, useRouter } from 'vue-router';
  import LiveChat from '@/components/LiveChat.vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ViewLiveStreamContent from '@/components/viewLiveStream/ViewLiveStreamContent.vue';
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { fetchViewLiveStreamByUsername, lastLiveStream } from '@/services/liveStream';
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
  const listDonation = ref([]);
  const theLastLiveStream = ref();

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
        connectOBS.value = isReady;
        fetchUserViewLive(username);
      });

      listenStreamMetrics((metrics) => {
        metricsData.value = metrics;
      });
    }
  };

  // Handle call last live
  const handleCallLastLive = async () => {
    const channelId = liveStreamData.value?.channel?.id;
    try {
      const response = await lastLiveStream(channelId);
      theLastLiveStream.value = response.data.data;
      console.log(theLastLiveStream.value);
      return response;
    } catch (error) {
      console.error('Error response:', error.response?.data || error.message);
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
      if (newLiveStatus === false) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await handleCallLastLive();
      }
    },
  );
</script>

<template>
  <Navbar />
  <div class="flex pt-[64px] h-screen">
    <SideBarFollow />
    <div class="flex-1 overflow-x-none pb-4 overflow-y-scroll">
      <RouterLink
        v-if="theLastLiveStream"
        :to="`/video/${theLastLiveStream.id}`"
        class="absolute top-28 left-[50%] -translate-x-1/2 z-[1000] cursor-pointer shadow-xl shadow-primary/40 rounded-full bg-gray-light slide-down-animation"
      >
        <button class="learn-more">
          <span class="circle" aria-hidden="true">
            <span class="icon arrow"></span>
          </span>
          <span class="button-text">View the latest stream</span>
        </button>
      </RouterLink>
      <ViewLiveStreamContent
        :connectOBS="connectOBS"
        :liveStatus="liveStatus"
        :username="username"
        :liveStreamData="liveStreamData"
        :metricsData="metricsData"
        :listDonation="listDonation"
        :theLastLiveStream="theLastLiveStream"
      />
    </div>
    <LiveChat
      :liveStreamData="liveStreamData.channel?.id"
      :listDonation="listDonation"
      :topDonators="metricsData?.topDonators"
    />
  </div>
</template>

<style scoped>
  .overflow-y-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .overflow-y-scroll::-webkit-scrollbar {
    display: none;
  }

  button {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
    background: transparent;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
  }

  button.learn-more {
    width: 16rem;
    height: auto;
  }

  button.learn-more .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: relative;
    display: block;
    margin: 0;
    width: 3rem;
    height: 3rem;
    background: #13d0b4;
    border-radius: 1.625rem;
  }

  button.learn-more .circle .icon {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
  }

  button.learn-more .circle .icon.arrow {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    left: 0.625rem;
    width: 1.125rem;
    height: 0.125rem;
    background: none;
  }

  button.learn-more .circle .icon.arrow::before {
    position: absolute;
    content: '';
    top: -0.29rem;
    right: 0.0625rem;
    width: 0.625rem;
    height: 0.625rem;
    border-top: 0.125rem solid #fff;
    border-right: 0.125rem solid #fff;
    transform: rotate(45deg);
  }

  button.learn-more .button-text {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.83rem 0;
    margin: 0 0 0 1.85rem;
    color: #13d0b4;
    font-weight: 500 !important;
    line-height: 1.6;
    text-align: center;
    font-size: 14px;
    text-transform: uppercase;
  }

  button:hover .circle {
    width: 100%;
  }

  button:hover .circle .icon.arrow {
    background: #fff;
    transform: translate(1rem, 0);
  }

  button:hover .button-text {
    color: #fff;
  }

  @keyframes slideDown {
    0% {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  .slide-down-animation {
    animation: slideDown 1s ease-out;
  }
</style>
