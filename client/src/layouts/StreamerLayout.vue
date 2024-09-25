<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarStreamer from '@/components/streamer/SideBarStreamer.vue';
</script>

<template>
  <Navbar />
  <div class="flex relative w-full pt-[72px] overflow-x-hidden">
    <SideBarStreamer />
    <div class="flex-1  overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
