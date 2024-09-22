<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ViewChannelsContent from '@/components/viewChannels/ViewChannelsContent.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px]">
    <SideBarFollow />
    <ViewChannelsContent />
  </div>
</template>
<style scoped></style>
