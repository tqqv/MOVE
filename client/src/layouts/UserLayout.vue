<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ScrollWrapper from './ScrollWrapper.vue';
</script>

<template>
  <Navbar />
  <div class="flex pt-[64px] h-screen">
    <SideBarFollow />
    <ScrollWrapper>
      <router-view />
    </ScrollWrapper>
  </div>
</template>
