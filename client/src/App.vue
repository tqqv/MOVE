<script setup>
  import { useUserStore } from '@/stores/user.store';
  import { onBeforeMount, onMounted } from 'vue';
  import GlobalLoading from './components/GlobalLoading.vue';
  import { useLoadingStore, useNotificationStore } from './stores';
  import { joinAllRooms } from './services/socketService';
  import { getLogout } from './services/auth';
  import { useRouter } from 'vue-router';
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();
  const notificationStore = useNotificationStore();
  const router = useRouter();
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
      localStorage.setItem('role', getCookie('role'));
    }
  });
  //Load data navbar when F5

  onMounted(async () => {
    const isLogin = localStorage.getItem('isLogin');

    if (isLogin === 'true') {
      await userStore.fetchUserProfile();
      await userStore.loadFollowers();
      await userStore.loadFollowCategories();
      notificationStore.fetchQuantifyNotifications();
      joinAllRooms();
      const role = localStorage.getItem('role');

      if (role !== userStore.user.role) {

        const res = await getLogout();
        if (res && res.status === 200) {
          userStore.clearUserData();
          localStorage.removeItem('isLogin');
          localStorage.removeItem('role');
        }
      }

      if(userStore.user.isBanned) {
        await userStore.fetchUserBanned();
        router.push('/banned');
      }
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
