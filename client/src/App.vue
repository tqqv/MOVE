<script setup>
  import { useUserStore } from '@/stores/user.store';
  import { onMounted } from 'vue';

  //Load data navbar when F5
  const userStore = useUserStore();
  onMounted(() => {
    const isLogin = localStorage.getItem('isLogin');

    if (isLogin === 'true') {
      userStore.fetchUserProfile();
    }
  });
</script>

<template>
  <router-view />
</template>
