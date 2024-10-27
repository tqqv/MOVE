<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import ProfileContent from '@/components/personalProfile/ProfileContent.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px] overflow-x-hidden">
    <ProfileContent />
  </div>
</template>
