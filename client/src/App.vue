<script setup>
  import { useUserStore } from '@/stores/user.store';
  import { onBeforeMount, onMounted } from 'vue';
  import GlobalLoading from './components/GlobalLoading.vue';
  import { useLoadingStore, useNotificationStore } from './stores';
  import { joinAllRooms } from './services/socketService';
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();
  const notificationStore = useNotificationStore();
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
      userStore.loadFollowCategories();
      notificationStore.fetchQuantifyNotifications();
      joinAllRooms();
    }
  });
  onMounted(() => {
    loadingStore.showLoading();
    setTimeout(() => {
      loadingStore.hideLoading();
    }, 1000);
  });
</script>

<template>
  <GlobalLoading />
  <router-view />
</template>
