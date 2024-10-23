<script setup>
  import LiveChat from '@/components/LiveChat.vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ViewLiveStreamContent from '@/components/viewLiveStream/viewLiveStreamContent.vue';
</script>

<template>
  <Navbar />
  <div class="flex pt-[72px]">
    <SideBarFollow />
    <div class="flex-1 overflow-y-auto overflow-x-none mb-4">
      <ViewLiveStreamContent />
    </div>
    <LiveChat />
  </div>
</template>
