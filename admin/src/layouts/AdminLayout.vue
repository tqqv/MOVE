<script setup>
  import AdminNavbar from '@/components/admin/AdminNavbar.vue';
  import AdminSideBar from '@/components/admin/AdminSideBar.vue';
  import ScrollWrapper from './ScrollWrapper.vue';
  import { ref } from 'vue';

  const openSidebar = ref(true);
  const handleOpenSidebar = () => {
    openSidebar.value = !openSidebar.value;
  };
</script>

<template>
  <div class="flex">
    <AdminSideBar />
    <div class="flex-grow flex flex-col h-screen">
      <AdminNavbar />
      <ScrollWrapper>
        <router-view />
      </ScrollWrapper>
    </div>
  </div>
</template>
