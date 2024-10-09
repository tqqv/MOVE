<script setup>
  import { ref } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';
  const connectCamera = ref(false);

  const updateConnectCamera = (value) => {
    connectCamera.value = value;
  };
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] bg-[#f0f2f5]">
    <SideBarLive :connectCamera="connectCamera" />
    <div class="flex-1 overflow-y-auto">
      <router-view @updateConnectCamera="updateConnectCamera" />
    </div>
  </div>
</template>
