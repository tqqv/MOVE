<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarStreamer from '@/components/streamer/SideBarStreamer.vue';
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px]">
    <SideBarStreamer />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
