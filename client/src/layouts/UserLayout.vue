<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';

</script>

<template>
  <Navbar />
  <div class="flex pt-[72px] h-full">
    <SideBarFollow />
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>
