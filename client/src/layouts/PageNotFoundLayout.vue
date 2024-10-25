<script setup>
  import Navbar from '@/components/Navbar.vue';
  import PageNotFound from '@/pages/PageNotFound.vue';
</script>

<template>
  <Navbar />
  <div>
    <PageNotFound />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
