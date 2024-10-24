<script setup>
  import { useUserStore } from '@/stores/user.store';
  import { onBeforeMount, onMounted } from 'vue';
  const userStore = useUserStore();

  const getCookie = (cname) => {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };

  onBeforeMount(() => {
    if (getCookie('isLogin')) {
      localStorage.setItem('isLogin', 'true');
    }
  });
  //Load data navbar when F5

  onMounted(() => {
    const isLogin = localStorage.getItem('isLogin');

    if (isLogin === 'true') {
      userStore.fetchUserProfile();
      userStore.loadFollowers();
    }
  });
</script>

<template>
  <router-view />
</template>
