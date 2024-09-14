<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import logo from '@assets/logo.svg';
  import verified from '@icons/verified.vue';
  import notification from '@icons/notification.vue';
  import upload from '@icons/upload.vue';
  import rep from '@icons/rep.vue';
  import InputGroup from 'primevue/inputgroup';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Avatar from 'primevue/avatar';
  import OverlayBadge from 'primevue/overlaybadge';
  import Divider from 'primevue/divider';
  import PopupAccount from '@components/PopupAccount.vue';
  import Notification from '@/components/notification/Notification.vue';
  import Login from '@/pages/Login.vue';
  import { usePopupStore } from '@/stores';
  import ForgotPasswordPopup from '@/components/popup/ForgotPasswordPopup.vue';
  import { useUserStore } from '@/stores';

  const isMobileMenuOpen = ref(false);
  const isUserMenuOpen = ref(false);
  const isNotiMenuOpen = ref(false);
  const popupStore = usePopupStore();
  const userStore = useUserStore();

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };
  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  };

  const toogleNotiMenu = () => {
    isNotiMenuOpen.value = !isNotiMenuOpen.value;
  };
  const openLoginPopup = () => {
    popupStore.openLoginPopup();
  };
  const handleClickOutside = (event) => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userNotiButton = document.getElementById('noti-menu-button');

    if (userMenuButton && !userMenuButton.contains(event.target)) {
      isUserMenuOpen.value = false;
    }
    if (userNotiButton && !userNotiButton.contains(event.target)) {
      isNotiMenuOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
<template>
  <nav class="bg-black text-white fixed w-full z-[100]">
    <div class="mx-auto px-4 py-1 sm:px-6 lg:px-8">
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
        <div class="flex items-center justify-center md:items-stretch md:justify-start">
          <div class="hidden md:block">
            <div class="flex space-x-4">
              <a
                href="#"
                class="rounded-md bg-gray-900 px-3 py-2 text_nav font-bold"
                aria-current="page"
                >Following</a
              >
              <a
                href="#"
                class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-gray-700 font-bold"
                >Browse</a
              >
            </div>
          </div>
        </div>
        <div
          class="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 h-8 w-auto"
        >
          <a href="#"><img class="h-8 w-auto" :src="logo" alt="Madison" /></a>
        </div>
        <div class="items-center gap-x-6 hidden md:flex">
          <!-- User -->
          <InputGroup class="h-[40px] hidden xl:flex">
            <InputText placeholder="Search" />
            <Button icon="pi pi-search" class="btn rounded-s-none" />
          </InputGroup>
          <!-- Guest -->
          <template v-if="!userStore.user">
            <Button class="btn px-[40px] text-nowrap" @click="openLoginPopup">Log In</Button>
          </template>

          <!-- User -->
          <template v-else
            ><h2 class="text-nowrap text_nav font-bold">Get REP$</h2>

            <div class="relative">
              <OverlayBadge
                value="4"
                severity="danger"
                class="inline-flex cursor-pointer"
                size="small"
                id="noti-menu-button"
                @click="toogleNotiMenu"
              >
                <notification fill="fill-white" class="scale-110" />
              </OverlayBadge>
              <div
                v-if="isNotiMenuOpen"
                class="absolute right-0 z-10 mt-[25px] origin-top-right rounded-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black border-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="noti-menu-button"
                tabindex="-1"
              >
                <Notification @toogleNotiMenu="toogleNotiMenu" />
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
                    :src="userStore.user?.avatar"
                    :alt="userStore.user?.username || 'User'"
                  />
                </button>
              </div>
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 z-10 mt-5 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <PopupAccount :user="userStore.user" />
              </div></div
          ></template>
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
  <Login v-model:visible="popupStore.showLoginPopup" />
  <ForgotPasswordPopup v-model:visible="popupStore.showForgotPasswordPopup" />
</template>
