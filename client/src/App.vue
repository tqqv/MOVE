<script setup>
  import { useUserStore } from '@/stores/user.store';
  import { onBeforeMount, onMounted } from 'vue';
  import GlobalLoading from './components/GlobalLoading.vue';
  import { useLoadingStore } from './stores';
  import { getLogout } from './services/auth';
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();

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

  onMounted(async() => {
    const isLogin = localStorage.getItem('isLogin');

    if (isLogin === 'true') {
      await userStore.fetchUserProfile();
      await userStore.loadFollowers();
      await userStore.loadFollowCategories();
      const role = localStorage.getItem('role')

      if(role !== userStore.user.role) {
        const res = await getLogout();
        console.log("vcc lun a cho");

        if(res && res.status === 200) {
          userStore.clearUserData();
          localStorage.removeItem('isLogin');
          localStorage.removeItem('role');
        }
      }

      if(userStore.user.isBanned) {
        await userStore.fetchUserBanned();
        console.log(userStore.user);
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
