<script setup>
  import Navbar from '@/components/Navbar.vue';
  import SideBarFollow from '@/components/SideBarFollow.vue';
  import CategoryDetailsContent from '@/components/CategoryDetails/CategoryDetailsContent.vue';
</script>

<template>
  <Navbar />
  <div class="flex w-full pt-[72px] overflow-x-hidden">
    <CategoryDetailsContent />
  </div>
</template>
