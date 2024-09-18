<script setup>
  import Navbar from '@/components/Navbar.vue';
  import ChannelSetting from '@/components/streamer/channelProfile/ChannelSetting.vue';
  import SideBarChannel from '@/components/streamer/SideBarStreamer.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px] overflow-x-hidden">
    <SideBarChannel />
    <ChannelSetting />
  </div>
</template>
