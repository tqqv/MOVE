<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarChannel from '@/components/streamer/SideBarStreamer.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px] overflow-x-hidden">
    <SideBarChannel />
    <div class="flex-1 h-[calc(100vh-72px)] overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
