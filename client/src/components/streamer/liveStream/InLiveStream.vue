<script setup>
  import { computed, onMounted, ref } from 'vue';
  import LiveChat from '@/components/LiveChat.vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import InformationLiveStream from './InformationLiveStream.vue';
  import NotConnectScreen from './NotConnectScreen.vue';
  import { useStreamerStore, useUserStore } from '@/stores';
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
  <div class="px-10 flex items-center flex-col">
    <div class="flex w-full justify-center mb-4 max-w-[1660px]">
      <div
        class="flex flex-col p-4 rounded-md basis-full justify-center shadow-md bg-white overflow-hidden max-w-full"
      >
        <div class="flex justify-center gap-x-16 py-4">
          <InformationLiveStream
            :elapsedTime="elapsedTime"
            :metricsData="metricsData"
            :liveStatus="liveStatus"
          />
        </div>
      </div>
    </div>
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
  </div>
</template>
