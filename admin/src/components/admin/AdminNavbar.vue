<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import logo from '@assets/logo.svg';
  import verified from '@icons/verified.vue';
  import notificationBell from '@icons/notification.vue';
  import upload from '@icons/upload.vue';
  import rep from '@icons/rep.vue';
  import Button from 'primevue/button';
  import Avatar from 'primevue/avatar';
  import Divider from 'primevue/divider';
  import PopupAccount from '@components/PopupAccount.vue';
  import Notification from '@/components/notification/Notification.vue';
  import { useUserStore } from '@/stores/user.store';
  import { RouterLink } from 'vue-router';

  const userStore = useUserStore();
  const isMobileMenuOpen = ref(false);
  const isUserMenuOpen = ref(false);
  const isNotiMenuOpen = ref(false);

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };
  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  };
  const toggleNotiMenu = () => {
    isNotiMenuOpen.value = !isNotiMenuOpen.value;
  };

  const closeAllPopups = () => {
    isUserMenuOpen.value = false;
    isNotiMenuOpen.value = false;
  };

  const isElementOutside = (element, target) => {
    return element && !element.contains(target);
  };
  const handleClickOutside = (event) => {
    const userMenu = document.getElementById('user-menu');
    const userMenuButton = document.getElementById('user-menu-button');
    const notiMenu = document.getElementById('noti-menu');
    const notiMenuButton = document.getElementById('noti-menu-button');
    const clickOutsideUserMenu =
      isElementOutside(userMenu, event.target) && isElementOutside(userMenuButton, event.target);
    const clickOutsideNotiMenu =
      isElementOutside(notiMenu, event.target) && isElementOutside(notiMenuButton, event.target);

    if (clickOutsideUserMenu) {
      isUserMenuOpen.value = false;
    }

    if (clickOutsideNotiMenu) {
      isNotiMenuOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
<template>
  <nav class="bg-white text-white fixed w-[calc(100%-281px)] z-[100] shadow-lg">
    <div class="mx-auto py-1 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <!-- Mobile menu button-->
        <div class="absolute inset-y-0 left-0 flex items-center md:hidden">
          <button
            @click="toggleMobileMenu"
            type="button"
            class="relative inline-flex items-center justify-center rounded-md py-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            :aria-expanded="isMobileMenuOpen"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Menu closed -->
            <svg
              v-if="!isMobileMenuOpen"
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <!-- Menu opened -->
            <svg
              v-else
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Nav items -->

        <div class="w-full items-center justify-end gap-x-6 hidden md:flex">
          <div class="relative" id="noti-menu-button">
            <!-- <div class="relative cursor-pointer" @click="toggleNotiMenu">
              <div class="mt-0.5">
                <notificationBell fill="#1c2434" class="scale-100" />
              </div>
              <div
                class="absolute top-[-9px] left-3 size-5 bg-[#ef4444] flex justify-center items-center rounded-full text-[11px]"
              >
                1
              </div>
            </div> -->
            <div
              v-if="isNotiMenuOpen"
              id="noti-menu"
              class="absolute right-0 z-10 mt-[25px] origin-top-right rounded-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black border-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="noti-menu-button"
              tabindex="-1"
            >
              <Notification @toggleNotiMenu="toggleNotiMenu" />
            </div>
          </div>
          <div class="relative">
            <div>
              <button
                @click="toggleUserMenu"
                type="button"
                class="relative size-[40px] flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="size-[40px] rounded-full"
                  :src="
                    userStore.user?.avatar ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  "
                  :alt="userStore.user?.username || 'User'"
                />
              </button>
            </div>
            <div
              v-if="isUserMenuOpen"
              id="user-menu"
              class="absolute right-0 z-10 mt-5 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <PopupAccount :user="userStore.user" @closeAllPopups="closeAllPopups" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-if="isMobileMenuOpen" class="md:hidden h-[100vh]" id="mobile-menu">
      <div class="space-y-1 px-4 pb-3 pt-2">
        <div class="flex items-center gap-x-2">
          <Avatar
            image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            class="size-[48px]"
            shape="circle"
          />
          <h2 class="text-[17px] font-semibold text-nowrap">duckies</h2>
          <verified class="fill-blue mt-[-2px]" />
        </div>
        <div class="flex items-center justify-between py-3 gap-x-6">
          <div class="w-[100%]">
            <Button class="btn w-[100%]">
              <upload />
              <p class="text-nowrap">Upload a video</p>
            </Button>
          </div>
          <div class="w-[100%]">
            <Button class="btn w-[100%]">
              <rep />
              <p class="text-nowrap">Get REP$</p>
            </Button>
          </div>
        </div>
        <Divider class="my-[10px]" />
      </div>
      <div class="py-3">
        <a
          href="#"
          class="relative flex items-center rounded-md text_nav text-gray-300 hover:bg-gray-700 hover:text-white py-3"
        >
          <div class="active-nav"></div>
          <p class="mx-4">Following</p>
        </a>
        <a
          href="#"
          class="relative flex items-center rounded-md text_nav text-gray-300 hover:bg-gray-700 hover:text-white py-3"
        >
          <div></div>
          <p class="mx-4">Browse</p>
        </a>
        <a
          href="#"
          class="relative flex items-center rounded-md text_nav text-gray-300 hover:bg-gray-700 hover:text-white py-3"
        >
          <div></div>
          <p class="mx-4">Settings</p>
        </a>
        <a
          href="#"
          class="relative flex items-center rounded-md text_nav text-gray-300 hover:bg-gray-700 hover:text-white py-3"
        >
          <p class="mx-4">More</p>
          <i class="pi pi-angle-down text-[24px]"></i>
        </a>
        <Button class="mx-4 btn px-[40px] text-nowrap mt-5">Logout</Button>
      </div>
      <div class="mx-4">
        <p>Term of Service</p>
        <p>Privacy policy</p>
      </div>
    </div>
  </nav>
</template>
