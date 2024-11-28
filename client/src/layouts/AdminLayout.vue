<script setup>
  import AdminNavbar from '@/components/admin/AdminNavbar.vue';
  import AdminSideBar from '@/components/admin/AdminSideBar.vue';
</script>

<template>
  <AdminNavbar />
  <div class="flex pt-[72px]">
    <AdminSideBar />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
