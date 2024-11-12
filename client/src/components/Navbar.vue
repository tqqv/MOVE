<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
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
  import { useUserStore } from '@/stores/user.store';
  import { RouterLink } from 'vue-router';
  import SearchPopup from './search/SearchPopup.vue';
  import { debounce } from '@/utils';
  import { searchInformation } from '@/services/search';
  import UploadVideo from './uploadVideo/UploadVideo.vue';
  import VideoDetail from './uploadVideo/VideoDetail.vue';
  import GoLive from './icons/goLive.vue';
  import { useTabStore } from '@/stores/tab.store';
  import GetREPS from './getReps/GetREPS.vue';
  import CompletePurchaseNoInfo from '@components/getReps/dialog/CompletePurchaseNoInfo.vue';
  import CompletePurchaseHaveInfo from '@components/getReps/dialog/CompletePurchaseHaveInfo.vue';
  import ProcessingPayment from '@components/getReps/dialog/ProcessingPayment.vue';
  import OrderStatusPopup from '@components/getReps/dialog/OrderStatusPopup.vue';
  const popupStore = usePopupStore();
  const userStore = useUserStore();
  const tabStore = useTabStore();

  const isMobileMenuOpen = ref(false);
  const isUserMenuOpen = ref(false);
  const isGetREPsMenuOpen = ref(false);
  const isNotiMenuOpen = ref(false);
  const isCreateMenuOpen = ref(false);

  // SEARCH
  const isSearchPopupOpen = ref(false);
  const onFocused = ref(false);
  const searchData = ref('');
  const categories = ref([]);
  const videos = ref([]);
  const users = ref([]);
  // SEARCH

  const isHaveInfo = ref(true);

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };
  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  };

  const toggleCreateMenu = () => {
    isCreateMenuOpen.value = !isCreateMenuOpen.value;
  };

  const toggleNotiMenu = () => {
    isNotiMenuOpen.value = !isNotiMenuOpen.value;
  };
  const toggleGetREPsMenu = () => {
    isGetREPsMenuOpen.value = !isGetREPsMenuOpen.value;
  };
  const closeAllPopups = () => {
    isUserMenuOpen.value = false;
    isNotiMenuOpen.value = false;
    isSearchPopupOpen.value = false;
    isGetREPsMenuOpen.value = false;
    isCreateMenuOpen.value = false;
    console.log('đóng nè');
  };

  const openLoginPopup = () => {
    popupStore.openLoginPopup();
    tabStore.setActiveTab('0');
  };
  const isElementOutside = (element, target) => {
    return element && !element.contains(target);
  };
  const handleClickOutside = (event) => {
    const userMenu = document.getElementById('user-menu');
    const userMenuButton = document.getElementById('user-menu-button');
    const notiMenu = document.getElementById('noti-menu');
    const notiMenuButton = document.getElementById('noti-menu-button');
    const searchMenu = document.getElementById('search-menu');
    const searchMenuButton = document.getElementById('search-menu-button');
    const createMenu = document.getElementById('create-menu');
    const createMenuButton = document.getElementById('create-menu-button');
    const repsMenu = document.getElementById('reps-menu');
    const repsMenuButton = document.getElementById('reps-menu-button');
    const clickOutsideUserMenu =
      isElementOutside(userMenu, event.target) && isElementOutside(userMenuButton, event.target);
    const clickOutsideNotiMenu =
      isElementOutside(notiMenu, event.target) && isElementOutside(notiMenuButton, event.target);
    const clickOutsideSearchMenu =
      isElementOutside(searchMenu, event.target) &&
      isElementOutside(searchMenuButton, event.target);
    const clickOutsideCreateMenu =
      isElementOutside(createMenu, event.target) &&
      isElementOutside(createMenuButton, event.target);

    const clickOutsideREPsMenu =
      isElementOutside(repsMenu, event.target) && isElementOutside(repsMenuButton, event.target);
    if (clickOutsideUserMenu) {
      isUserMenuOpen.value = false;
    }

    if (clickOutsideNotiMenu) {
      isNotiMenuOpen.value = false;
    }

    if (clickOutsideSearchMenu) {
      isSearchPopupOpen.value = false;
    }

    if (clickOutsideCreateMenu) {
      isCreateMenuOpen.value = false;
    }
    if (clickOutsideREPsMenu) {
      isGetREPsMenuOpen.value = false;
    }
  };

  // SEARCH

  // const handleSearch = debounce((e) => {
  //   searchData.value = e.target.value;
  //   console.log(searchData.value);

  //   if (searchData.value.trim() === '' && onFocused.value) {
  //     isSearchPopupOpen.value = false;
  //   } else {
  //     isSearchPopupOpen.value = true;
  //   }
  // }, 500);

  const handleFocus = () => {
    onFocused.value = true;
    if (searchData.value.trim()) {
      isSearchPopupOpen.value = true;
    }
  };

  const handleBlur = () => {
    onFocused.value = false;
  };

  const handleSearch = (e) => {
    searchData.value = e.target.value;
    if (searchData.value.trim() === '' && onFocused.value) {
      isSearchPopupOpen.value = false;
    } else {
      isSearchPopupOpen.value = true;
    }
  };

  const debouncedSearch = debounce(async (newSearchData) => {
    if (newSearchData) {
      try {
        const response = await searchInformation(newSearchData, 2, 0);
        const data = response.data.data;
        categories.value = data.categories;
        videos.value = data.videos;
        users.value = data.users;
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      categories.value = [];
      videos.value = [];
      users.value = [];
    }
  }, 500);

  watch(
    () => searchData.value,
    (newSearchData) => {
      debouncedSearch(newSearchData);
    },
  );

  const performSearch = () => {
    if (searchData.value.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchData.value.trim())}`;
      isSearchPopupOpen.value = false;
    }
  };

  // SEARCH

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
<template>
  <nav class="bg-[#18181b] text-white fixed w-full z-[100]">
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
              <RouterLink
                to="#"
                class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-primary font-bold"
                aria-current="page"
                >Following</RouterLink
              >
              <RouterLink
                to="/browse/categories"
                class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-primary font-bold"
                >Browse</RouterLink
              >
            </div>
          </div>
        </div>
        <div
          class="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 h-8 w-auto"
        >
          <RouterLink to="/"><img class="h-8 w-auto" :src="logo" alt="Madison" /></RouterLink>
        </div>
        <div class="items-center gap-x-6 hidden md:flex">
          <!-- User -->
          <div class="relative">
            <InputGroup class="h-[40px] min-w-[292px] hidden xl:flex">
              <InputText
                class="text-sm"
                id="search-menu-button"
                placeholder="Search"
                v-model="searchData"
                autocomplete="off"
                @input="handleSearch"
                @keyup.enter="performSearch"
                @focus="handleFocus"
                @blur="handleBlur"
              />
              <Button icon="pi pi-search" class="btn rounded-s-none" @click="performSearch" />
            </InputGroup>
            <div
              v-if="isSearchPopupOpen"
              id="search-menu"
              class="absolute w-full bot z-10 mt-2"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="search-menu-button"
              tabindex="-1"
            >
              <SearchPopup
                :categories="categories"
                :videos="videos"
                :users="users"
                :searchData="searchData"
              />
            </div>
          </div>
          <template v-if="userStore.user?.role == 'streamer'">
            <div class="relative">
              <div>
                <button class="btn leading-none" @click="toggleCreateMenu" id="create-menu-button">
                  Create
                </button>
              </div>

              <div
                class="absolute right-0 z-10 mt-5 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
                v-if="isCreateMenuOpen"
                id="create-menu"
              >
                <div class="shadow-lg rounded-md w-[180px]">
                  <div class="px-4 py-5">
                    <div class="flex flex-col gap-y-4 px-1 justify-start text-[13px] text-nowrap">
                      <RouterLink
                        to="/streaming/stream-setup"
                        class="flex flex-row items-center gap-x-2 group cursor-pointer"
                      >
                        <GoLive />
                        <h1 class="group-hover:text-primary">Go Live</h1>
                      </RouterLink>
                      <button
                        class="flex flex-row items-center gap-x-2 group cursor-pointer"
                        @click="popupStore.openUploadVideoPopup"
                      >
                        <upload />
                        <h1 class="group-hover:text-primary">Upload a video</h1>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Guest -->
          <template v-if="!userStore.user">
            <Button class="btn px-[40px] text-nowrap" @click="openLoginPopup">Log In</Button>
          </template>

          <!-- User -->
          <template v-else>
            <div v-if="userStore.user?.role == 'user'" class="relative">
              <div
                @click="toggleGetREPsMenu"
                class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-primary font-bold text-nowrap cursor-pointer"
                id="reps-menu-button"
              >
                Get REP$
              </div>
              <div
                id="reps-menu"
                class="absolute right-0 z-10 mt-[25px] origin-top-right rounded-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black border-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="reps-menu-button"
                tabindex="-1"
              >
                <GetREPS
                  :isBackVisible="false"
                  v-if="isGetREPsMenuOpen"
                  @toggleGetREPsMenu="toggleGetREPsMenu"
                  @toggleBuyREPs="popupStore.toggleBuyREPs"
                />
              </div>
            </div>

            <div class="relative">
              <OverlayBadge
                value="4"
                severity="danger"
                class="inline-flex cursor-pointer"
                size="small"
                id="noti-menu-button"
                @click="toggleNotiMenu"
              >
                <notification fill="fill-white" class="scale-110" />
              </OverlayBadge>
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
                    :src="userStore.user?.avatar"
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
          </template>
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
  <Login />
  <ForgotPasswordPopup v-model:visible="popupStore.showForgotPasswordPopup" />
  <UploadVideo />
  <VideoDetail />
  <!-- POPUP GET REPS -->
  <CompletePurchaseNoInfo
    v-if="!isHaveInfo"
    title="Complete Purchase"
    :isOpenBuyREPs="popupStore.showOpenBuyREPs"
  />
  <CompletePurchaseHaveInfo
    v-else
    title="Complete Purchase"
    :isOpenBuyREPs="popupStore.showOpenBuyREPs"
  />
  <ProcessingPayment />
  <!-- <OrderStatusPopup
    :isOpenOrder="isOpenOrder"
    :money="purchaseOptions.money"
    :reps="purchaseOptions.reps"
    :isOrderSuccessful="isOrderSuccessful"
    @toggleOrder="toggleOrder"
  /> -->
</template>
