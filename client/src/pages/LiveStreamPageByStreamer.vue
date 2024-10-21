<script setup>
  import { ref } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarLive from '@/components/streamer/liveStream/SideBarLive.vue';

  const statusLive = ref('beforeLive');

  const connectOBS = ref(true);
  const updateStatusLive = (value) => {
    statusLive.value = value;
  };
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] bg-[#f0f2f5]">
    <SideBarLive
      :connectOBS="connectOBS"
      :statusLive="statusLive"
      @updateStatusLive="updateStatusLive"
    />
    <div class="flex-1 overflow-y-auto">
      <router-view :statusLive="statusLive" :connectOBS="connectOBS" />
    </div>
  </div>
</template>
