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
  import { debounce } from '@/utils/debounce';
  import { searchInformation } from '@/services/search';
  import UploadVideo from './uploadVideo/UploadVideo.vue';
  import VideoDetail from './uploadVideo/VideoDetail.vue';
  const popupStore = usePopupStore();
  const userStore = useUserStore();

  const isMobileMenuOpen = ref(false);
  const isUserMenuOpen = ref(false);
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

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };
  const toggleUserMenu = () => {
    closeAllPopups();
    isUserMenuOpen.value = !isUserMenuOpen.value;
  };

  const toggleCreateMenu = () => {
    closeAllPopups();
    isCreateMenuOpen.value = !isCreateMenuOpen.value;
  };

  const toogleNotiMenu = () => {
    closeAllPopups();
    isNotiMenuOpen.value = !isNotiMenuOpen.value;
  };

  const closeAllPopups = () => {
    isUserMenuOpen.value = false;
    isNotiMenuOpen.value = false;
    isSearchPopupOpen.value = false;
  };

  const openLoginPopup = () => {
    popupStore.openLoginPopup();
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
  };

  // SEARCH

  const handleSearch = debounce((e) => {
    searchData.value = e.target.value;
    if (searchData.value.trim() === '' && onFocused.value) {
      isSearchPopupOpen.value = false;
    } else {
      isSearchPopupOpen.value = true;
    }
  }, 500);

  const handleFocus = () => {
    onFocused.value = true;
    if (searchData.value.trim()) {
      isSearchPopupOpen.value = true;
    }
  };

  const handleBlur = () => {
    onFocused.value = false;
  };

  watch(
    () => searchData.value,
    async (newSearchData) => {
      if (newSearchData) {
        try {
          const response = await searchInformation(newSearchData);
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
    },
  );

  const performSearch = () => {
    if (searchData.value.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchData.value.trim())}`;
    }
  };

  // SEARCH

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

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
              <RouterLink
                to="#"
                class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-primary font-bold"
                aria-current="page"
                >Following</RouterLink
              >
              <RouterLink
                to="/browse"
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
                      <button class="flex flex-row items-center gap-x-2 group cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g id="Group_2442" data-name="Group 2442" transform="translate(-15 -14)">
                            <rect
                              id="Rectangle_854"
                              data-name="Rectangle 854"
                              width="24"
                              height="24"
                              transform="translate(15 14)"
                              fill="none"
                            />
                            <g
                              id="Group_2441"
                              data-name="Group 2441"
                              transform="translate(-320.423 -848.196)"
                            >
                              <path
                                id="Path_1057"
                                data-name="Path 1057"
                                d="M351.01,870h-6.045a2.56,2.56,0,0,0-2.565,2.565v4.03a2.56,2.56,0,0,0,2.565,2.565h6.045a2.56,2.56,0,0,0,2.565-2.565v-4.03A2.621,2.621,0,0,0,351.01,870Zm-.366,5.129-4.03,2.015c-.092,0-.183.092-.275.092a.336.336,0,0,1-.275-.092.554.554,0,0,1-.275-.55v-4.03a.792.792,0,0,1,.275-.55.584.584,0,0,1,.55,0l4.03,2.015a.6.6,0,0,1,0,1.1Z"
                                transform="translate(-0.586 -0.152)"
                                fill="red"
                              />
                              <path
                                id="Path_1058"
                                data-name="Path 1058"
                                d="M341,870.916a.559.559,0,0,0-.275-.824.543.543,0,0,0-.824.275,8.98,8.98,0,0,0,0,8.61.554.554,0,0,0,.55.275.336.336,0,0,0,.275-.092.739.739,0,0,0,.275-.824A7.635,7.635,0,0,1,341,870.916Z"
                                transform="translate(-0.284 -0.152)"
                              />
                              <path
                                id="Path_1059"
                                data-name="Path 1059"
                                d="M355.966,870.092a.739.739,0,0,0-.275.824,7.635,7.635,0,0,1,0,7.419.559.559,0,0,0,.275.824.336.336,0,0,0,.275.092.653.653,0,0,0,.55-.275,8.98,8.98,0,0,0,0-8.61A.559.559,0,0,0,355.966,870.092Z"
                                transform="translate(-1.695 -0.152)"
                              />
                              <path
                                id="Path_1060"
                                data-name="Path 1060"
                                d="M360.623,870.223a5.57,5.57,0,0,0-.824-1.649.6.6,0,1,0-1.008.641,8.121,8.121,0,0,1,.733,1.557,10.608,10.608,0,0,1,0,7.511,12.983,12.983,0,0,1-.733,1.649.6.6,0,0,0,.183.824.336.336,0,0,0,.275.092.653.653,0,0,0,.55-.275,6.612,6.612,0,0,0,.824-1.832A12.378,12.378,0,0,0,360.623,870.223Z"
                                transform="translate(-1.956 -0.008)"
                              />
                              <path
                                id="Path_1061"
                                data-name="Path 1061"
                                d="M337.967,869.116a.6.6,0,1,0-1.008-.641,6.612,6.612,0,0,0-.824,1.832,11.872,11.872,0,0,0,.092,8.335,5.569,5.569,0,0,0,.824,1.649.554.554,0,0,0,.55.275.337.337,0,0,0,.275-.092.6.6,0,0,0,.183-.824,8.119,8.119,0,0,1-.733-1.557,10.608,10.608,0,0,1,0-7.511A8.94,8.94,0,0,1,337.967,869.116Z"
                                transform="translate(0 0)"
                              />
                            </g>
                          </g>
                        </svg>
                        <h1 class="group-hover:text-primary">Go Live</h1>
                      </button>
                      <button
                        class="flex flex-row items-center gap-x-2 group cursor-pointer"
                        @click="popupStore.openUploadVideoPopup"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g id="Group_2444" data-name="Group 2444" transform="translate(-15 -46)">
                            <rect
                              id="Rectangle_855"
                              data-name="Rectangle 855"
                              width="24"
                              height="24"
                              transform="translate(15 46)"
                              fill="none"
                            />
                            <g
                              id="Group_2443"
                              data-name="Group 2443"
                              transform="translate(-322.5 -847.9)"
                            >
                              <path
                                id="Path_1069"
                                data-name="Path 1069"
                                d="M360.342,898.468l-4.421,2.675v-.963a4.191,4.191,0,0,0-4.211-4.279h-10a4.191,4.191,0,0,0-4.211,4.279v7.81a4.191,4.191,0,0,0,4.211,4.279h6.316a5.216,5.216,0,0,1,5.053-4.386h0a5.157,5.157,0,0,1,2.737.856c0-.214.105-.535.105-.749v-.963l4.421,2.675a.766.766,0,0,0,1.158-.749v-9.628C361.5,898.468,360.868,898.147,360.342,898.468Zm-10.316,5.884-4.842,2.781c-.211.107-.632,0-.632-.321v-5.563a.416.416,0,0,1,.632-.321l4.842,2.781C350.237,903.71,350.237,904.245,350.026,904.352Z"
                              />
                              <path
                                id="Path_1070"
                                data-name="Path 1070"
                                d="M352.3,907.8a4.2,4.2,0,1,0,4.2,4.2A4.225,4.225,0,0,0,352.3,907.8Zm2.2,4.9H353v1.5a.7.7,0,1,1-1.4,0v-1.5h-1.5a.7.7,0,0,1,0-1.4h1.5v-1.5a.7.7,0,1,1,1.4,0v1.5h1.5a.684.684,0,0,1,.7.7A.751.751,0,0,1,354.5,912.7Z"
                                transform="translate(0.883 1.068)"
                                fill="#13d0b4"
                              />
                            </g>
                          </g>
                        </svg>
                        <h1 class="mb-1 group-hover:text-primary">Upload a video</h1>
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
          <template v-else
            ><RouterLink
              v-if="userStore.user?.role == 'user'"
              class="rounded-md px-3 py-2 text_nav text-gray-300 hover:bg-primary font-bold text-nowrap cursor-pointer"
            >
              Get REP$
            </RouterLink>

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
                id="noti-menu"
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
                id="user-menu"
                class="absolute right-0 z-10 mt-5 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <PopupAccount :user="userStore.user" />
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
  <Login v-model:visible="popupStore.showLoginPopup" />
  <ForgotPasswordPopup v-model:visible="popupStore.showForgotPasswordPopup" />
  <UploadVideo />
  <VideoDetail />
</template>
