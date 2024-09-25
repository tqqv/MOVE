<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';

</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px] overflow-x-hidden">
    <SideBarFollow />
    <div class="flex-1  overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
