<script setup>
  import logo from '@assets/logo.svg';

  import verified from '@icons/verified.vue';
  import dashboard from '@icons/dashboard.vue';
  import wallet from '@icons/wallet.vue';
  import logout from '@icons/logout.vue';
  import notification from '@icons/notification.vue';
  import setting from '@icons/setting.vue';
  import upload from '@icons/upload.vue';
  import rep from '@icons/rep.vue';

  import InputGroup from 'primevue/inputgroup';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Avatar from 'primevue/avatar';
  import OverlayBadge from 'primevue/overlaybadge';
  import Divider from 'primevue/divider';

  import { ref } from 'vue';

  const isMobileMenuOpen = ref(false);

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };
</script>
<template>
  <nav class="bg-black text-white fixed w-full z-[99999]">
    <div class="mx-auto px-4 py-1 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center md:hidden">
          <!-- Mobile menu button-->
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
              <a href="#" class="rounded-md bg-gray-900 px-3 py-2 text_nav" aria-current="page"
                >Following</a
              >
              <a href="#" class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-gray-700"
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
          <!-- <Button class="btn px-[40px] text-nowrap">Log In</Button> -->
          <h2 class="text-nowrap text_nav">Get REP$</h2>
          <OverlayBadge value="4" severity="danger" class="inline-flex">
            <notification fill="fill-white" />
          </OverlayBadge>
          <div class="relative">
            <div>
              <button
                type="button"
                class="relative size-[40px] flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="size-[40px] rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>
            <!-- <div
              class="absolute right-0 z-10 mt-5 w-[255px] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <div class="p-[16px]">
                <div class="flex items-center gap-x-2">
                  <Avatar
                    image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    class="size-[48px]"
                    shape="circle"
                  />
                  <h2 class="text-[17px] font-semibold text-nowrap">duckies</h2>
                  <verified class="fill-blue mt-[-5px]" />
                </div>
                <Divider class="my-[6px]" />
                <div>
                  <a
                    href="#"
                    class="block py-1 group"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-0"
                    ><div class="flex items-center gap-x-1">
                      <dashboard class="mt-1 group-hover:fill-primary" />
                      <p class="text_para">Dashboard</p>
                    </div></a
                  >
                  <a
                    href="#"
                    class="group block py-1"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-1"
                    ><div class="flex items-center gap-x-1">
                      <wallet class="group-hover:fill-primary" />
                      <p class="text_para">Wallet (0 REPs)</p>
                    </div></a
                  >
                </div>
                <Divider class="my-[6px]" />
                <a
                  href="#"
                  class="group block py-1"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-1"
                  ><div class="flex items-center gap-x-1">
                    <setting class="ml-[-3px] group-hover:fill-primary" />
                    <p class="text_para">Settings</p>
                  </div></a
                >
                <Divider class="my-[6px]" />
                <a
                  href="#"
                  class="group block py-1"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-1"
                  ><div class="flex items-center gap-x-1">
                    <logout class="mt-1 group-hover:fill-primary" />
                    <p class="text_para">Log out</p>
                  </div></a
                >
              </div>
            </div> -->
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
