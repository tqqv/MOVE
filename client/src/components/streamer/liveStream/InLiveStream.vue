<script setup>
  import { ref } from 'vue';
  import LiveChat from '@/components/LiveChat.vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import InformationLiveStream from './InformationLiveStream.vue';

  const linkStream = ref('https://www.facebook.com/profile.php?id=61550073242459');
</script>
<template>
  <div class="px-10 flex items-center flex-col">
    <div class="flex w-full justify-center mb-4 max-w-[1660px]">
      <div
        class="flex flex-col p-4 rounded-md basis-full justify-center shadow-md bg-white overflow-hidden max-w-full"
      >
        <div class="flex justify-center gap-x-16 py-4">
          <InformationLiveStream />
        </div>
      </div>
    </div>
    <div class="w-full flex gap-x-8 justify-center">
      <div
        class="flex flex-col max-w-[1284px] min-w-[700px] rounded-md basis-full justify-center shadow-md bg-white overflow-hidden"
      >
        <div class="flex flex-col w-full p-4">
          <LiveStreamScreen />
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
