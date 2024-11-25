<script setup>
  import { computed, onMounted, ref } from 'vue';
  import LiveChat from '@/components/LiveChat.vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import InformationLiveStream from './InformationLiveStream.vue';
  import NotConnectScreen from './NotConnectScreen.vue';
  import { useStreamerStore, useUserStore } from '@/stores';
  import ChartLive from './ChartLive.vue';
  import TopDonates from './TopDonates.vue';
  const props = defineProps({
    liveStatus: String,
    connectOBS: String,
    elapsedTime: Number,
    metricsData: Object,
  });

  const userStore = useUserStore();
  const streamerStore = useStreamerStore();

  const liveStreamData = computed(() => streamerStore?.streamerChannel?.id);
</script>
<template>
  <div class="px-10 flex items-center flex-col gap-y-7">
    <div class="w-full flex gap-x-8 justify-center">
      <div
        class="flex flex-col max-w-[1284px] min-w-[700px] rounded-md basis-full justify-center shadow-md bg-white overflow-hidden"
      >
        <div class="flex flex-col w-full p-4">
          <!-- SCREEN DONT" CONNET OBS -->
          <NotConnectScreen
            v-if="
              (props.connectOBS == null || props.connectOBS == 'null') && props.liveStatus == null
            "
          />
          <!-- SCREEN CONNECT OBCS -->
          <div class="flex w-full">
            <LiveStreamScreen
              v-if="
                props.connectOBS === 'streamPublished' ||
                props.liveStatus === 'streamPublished' ||
                props.liveStatus === 'streamReady'
              "
              :username="userStore.user.username"
              :isStreamer="true"
            />
          </div>
          <div class="mt-5 px-2 mb-2">
            <div class="flex w-full items-center justify-between gap-x-3">
              <p class="font-semibold">Your screen</p>
            </div>
          </div>
        </div>
      </div>
      <!-- CHAT -->
      <LiveChat :liveStreamData="liveStreamData" :isStreamer="true" />
    </div>
    <div class="w-full flex gap-x-8 justify-center">
      <!-- Information -->
      <div class="flex max-w-[700px] w-[580px] flex-col basis-2/5">
        <div class="bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <h1 class="font-semibold mb-4">Insights</h1>
          <div class="grid grid-cols-2 gap-y-8 gap-x-16 mb-4 items-start ml-3">
            <InformationLiveStream
              :elapsedTime="elapsedTime"
              :metricsData="metricsData"
              :liveStatus="liveStatus"
            />
          </div>
        </div>
      </div>
      <!-- Chart -->
      <div class="flex max-w-[896px] w-[700px] max-h-[500px] flex-col basis-3/5">
        <div class="bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <h1 class="font-semibold mb-4">Chart</h1>
          <!-- <ChartLive /> -->
        </div>
      </div>
    </div>
  </div>
</template>
