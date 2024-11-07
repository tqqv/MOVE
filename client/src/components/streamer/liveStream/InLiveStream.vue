<script setup>
  import { ref } from 'vue';
  import LiveChat from '@/components/LiveChat.vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import InformationLiveStream from './InformationLiveStream.vue';
  import NotConnectScreen from './NotConnectScreen.vue';
  import { useUserStore } from '@/stores';
  const props = defineProps({
    liveStatus: String,
    connectOBS: String,
    elapsedTime: Number,
    metricsData: Object,
  });

  const userStore = useUserStore();
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
          <div
            v-if="
              (props.connectOBS == null || props.connectOBS == 'null') && props.liveStatus == null
            "
            class="flex w-full"
          >
            <NotConnectScreen />
          </div>
          <!-- SCREEN CONNECT OBCS -->
          <div
            v-if="
              props.connectOBS === 'streamPublished' ||
              props.liveStatus === 'streamPublished' ||
              props.liveStatus === 'streamReady'
            "
            class="flex w-full"
          >
            <LiveStreamScreen :username="userStore.user.username" />
          </div>
          <div class="mt-5 px-2">
            <div class="flex w-full items-center justify-between gap-x-3">
              <p class="font-semibold">Your screen</p>
              <div
                class="p-2 flex justify-center items-center rounded-full cursor-pointer hover:bg-gray-light"
              >
                <i class="pi pi-arrow-down-left-and-arrow-up-right-to-center text-body"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- CHAT -->
      <LiveChat :isStreamer="true" />
    </div>
  </div>
</template>
