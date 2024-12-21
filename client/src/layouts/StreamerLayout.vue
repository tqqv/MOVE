<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarStreamer from '@/components/streamer/SideBarStreamer.vue';
  import ScrollWrapper from './ScrollWrapper.vue';
</script>

<template>
  <Navbar />
  <div class="flex pt-[64px] h-screen">
    <SideBarStreamer />
    <ScrollWrapper>
      <router-view />
    </ScrollWrapper>
  </div>
</template>
