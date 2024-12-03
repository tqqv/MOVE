<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SearchContent from '@/components/search/SearchContent.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[64px]">
    <SearchContent />
  </div>
</template>
<style scoped></style>
