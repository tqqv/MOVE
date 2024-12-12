<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import logo from '@assets/logo.svg';
  import HomeIcon from '@icons/home.vue';
  import VideoIcon from '@icons/videos.vue';
  import CommentIcon from '@icons/comment.vue';
  import CashoutIcon from '@icons/cashout.vue';
  import SettingIcon from '@icons/setting.vue';
  import User from '../icons/user.vue';
  import Category from '../icons/category.vue';
  import Level from '../icons/level.vue';
  import Flag from '../icons/flag.vue';
  import Request from '../icons/request.vue';
  import Logout from '../icons/logout.vue';
  import Booking from '../icons/booking.vue';

  const route = useRoute();
  const isDropdownOpen = ref(false);

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, link: '/dashboard' },
    { name: 'User Management', icon: User, link: '/users' },
    {
      name: 'REP$ System',
      icon: CashoutIcon,
      link: '/reps/revenue',
      hasDropdown: true,
      submenu: [
        { name: 'Revenue', link: '/reps/revenue' },
        { name: 'Donate Item', link: '/reps/donate' },
        { name: 'Discount Item', link: '/reps/discount' },
      ],
    },
    { name: 'Category Management', icon: Category, link: '/category' },
    { name: 'Level Management', icon: Level, link: '/levelworkout' },
    { name: 'Report Management', icon: Flag, link: '/report' },
    { name: 'Booking management', icon: Booking, link: '/booking-management' },
    { name: 'Request Channel', icon: Request, link: '/request' },
    { name: 'Settings', icon: SettingIcon, link: '/setting' },
  ];
</script>

<template>
  <div class="sticky h-[100vh] w-[281px] bg-dark shadow-xl flex-shrink-0">
    <div class="flex justify-center items-center py-8 mr-2">
      <RouterLink to="/dashboard"><img class="h-8 w-auto" :src="logo" alt="Madison" /></RouterLink>
    </div>
    <div
      class="flex flex-col justify-between h-[calc(100vh-100px)] overflow-y-scroll scrollbar-custom"
    >
      <ul>
        <li v-for="item in menuItems" :key="item.name" class="block mx-2 mb-1">
          <router-link :to="item.link" class="block">
            <div
              class="p-4 cursor-pointer group hover:bg-[#333a48] flex gap-x-4 font-semibold items-center rounded-md text-white"
              :class="{
                'bg-primary/85 font-bold hover:bg-primary/85':
                  route.path === item.link ||
                  (item.link !== '/reps' && route.path.startsWith(item.link)),
              }"
              @click="item.hasDropdown && toggleDropdown()"
            >
              <component :is="item.icon" fill="#fff" />
              <p class="text-sm">{{ item.name }}</p>
              <span
                v-if="item.hasDropdown"
                class="ml-auto"
                :class="isDropdownOpen ? 'pi pi-angle-up' : 'pi pi-angle-down'"
              ></span>
            </div>
          </router-link>

          <!-- Submenu -->
          <ul v-if="isDropdownOpen && item.hasDropdown" class="ml-4 mt-1">
            <li v-for="subitem in item.submenu" :key="subitem.name" class="block mx-2 mb-1">
              <router-link :to="subitem.link" class="block">
                <div
                  class="p-2 cursor-pointer group hover:text-white flex items-center rounded-md text-gray-dark"
                  :class="{
                    ' font-bold  text-white': route.path.startsWith(subitem.link),
                  }"
                >
                  <p class="text-sm">{{ subitem.name }}</p>
                </div>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <div
        class="flex items-center gap-x-4 mx-2 mt-24 p-4 mb-3 text-white rounded-md cursor-pointer hover:bg-[#333a48]"
      >
        <Logout fill="#fff" />
        <span class="text-sm font-semibold">Logout</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .scrollbar-custom::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  .scrollbar-custom:hover::-webkit-scrollbar {
    background-color: #1c2434;
  }

  .scrollbar-custom::-webkit-scrollbar-thumb {
    background-color: #1c2434;
    border-radius: 4px;
  }

  .scrollbar-custom::-webkit-scrollbar-track {
    background-color: #1c2434;
    border-radius: 4px;
  }

  .scrollbar-custom:hover::-webkit-scrollbar-thumb {
    background-color: rgba(19, 208, 180, 0.8);
  }
</style>
