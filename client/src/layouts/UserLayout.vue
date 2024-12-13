<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ScrollWrapper from './ScrollWrapper.vue';
  import ToastNotification from '@/components/ToastNotification.vue';
</script>

<template>
  <Navbar />
  <div class="flex pt-[64px] h-screen relative">
    <SideBarFollow />
    <ScrollWrapper>
      <router-view />
    </ScrollWrapper>
    <ToastNotification />
  </div>
</template>
