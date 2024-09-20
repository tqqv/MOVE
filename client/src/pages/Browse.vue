<script setup>
  import BrowseContent from '@/components/browse/BrowseContent.vue';
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px]">
    <SideBarFollow />
    <BrowseContent />
  </div>
</template>
<style scoped></style>
