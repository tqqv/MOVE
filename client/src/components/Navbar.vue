<script setup>
  import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
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
  import { useNotificationStore, usePopupStore } from '@/stores';
  import ForgotPasswordPopup from '@/components/popup/ForgotPasswordPopup.vue';
  import { useUserStore } from '@/stores/user.store';
  import { RouterLink, useRouter } from 'vue-router';
  import SearchPopup from './search/SearchPopup.vue';
  import { debounce, formatView } from '@/utils';
  import { searchInformation } from '@/services/search';
  import UploadVideo from './uploadVideo/UploadVideo.vue';
  import VideoDetail from './uploadVideo/VideoDetail.vue';
  import GoLive from './icons/goLive.vue';
  import { useTabStore } from '@/stores/tab.store';
  import { useGetRepsStore } from '@/stores/getReps.store';
  import { getPaymentHistory } from '@/services/payment';
  import { toast } from 'vue3-toastify';

  import GetREPS from './getReps/GetREPS.vue';
  import ProcessingPayment from '@components/getReps/dialog/ProcessingPayment.vue';
  import OrderStatusPopup from '@components/getReps/dialog/OrderStatusPopup.vue';
  import Stream from './icons/Stream.vue';
  import CompletePurchase from '@/components/getReps/dialog/CompletePurchase.vue';
  import ListShowMore from './showMore/listShowMore.vue';
  import Dashboard from './icons/dashboard.vue';
  import Wallet from './icons/wallet.vue';
  import { formatNumber } from '@/utils';
  import { disconnectAllRooms } from '@/services/socketService';
  import { getLogout } from '@/services/auth';
  import Setting from './icons/setting.vue';

  const popupStore = usePopupStore();
  const userStore = useUserStore();
  const tabStore = useTabStore();
  const notificationStore = useNotificationStore();
  const getRepsStore = useGetRepsStore();
  const isOpenOrder = ref(false);
  const isMobileMenuOpen = ref(false);
  const isUserMenuOpen = ref(false);
  const isGetREPsMenuOpen = ref(false);
  const isNotiMenuOpen = ref(false);
  const isCreateMenuOpen = ref(false);
  const isPaymentHistoryFetched = ref(false);
  const isShowMore = ref(false);
  const router = useRouter();
  const isDropdownVisible = ref(false);

  const isFirstTime = ref(false);
  // SEARCH
  const isSearchPopupOpen = ref(false);
  const onFocused = ref(false);
  const searchData = ref('');
  const categories = ref([]);
  const videos = ref([]);
  const users = ref([]);
  const loading = ref(true);

  const quantityNotifications = computed(() => {
    return notificationStore?.quantityNotifications?.unRecievedCount || 0;
  });

  // SEARCH
  const toggleShowMoreMenu = () => {
    isShowMore.value = !isShowMore.value;
  };
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
    if (quantityNotifications.value > 0) {
      notificationStore.markReceivedQuantity();
    }
    if (quantityNotifications.value === 0) {
      return;
    }
  };
  const toggleGetREPsMenu = () => {
    isGetREPsMenuOpen.value = !isGetREPsMenuOpen.value;

    if (!isPaymentHistoryFetched.value) {
      fetchPaymentHistory();
      isPaymentHistoryFetched.value = true;
    }

    if (!getRepsStore.purchaseOptions.length > 0) {
      getRepsStore.getRepPackages();
    }
  };

  const closeAllPopups = () => {
    isUserMenuOpen.value = false;
    isNotiMenuOpen.value = false;
    isSearchPopupOpen.value = false;
    isGetREPsMenuOpen.value = false;
    isCreateMenuOpen.value = false;
    isShowMore.value = false;
  };
  const toggleOpenOrder = () => {
    isOpenOrder.value = !isOpenOrder.value;
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
    const showMoreMenu = document.getElementById('show-more');
    const showMoreMenuButton = document.getElementById('show-more-button');
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
    const clickOutsideShowMoreMenu =
      isElementOutside(showMoreMenu, event.target) &&
      isElementOutside(showMoreMenuButton, event.target);
    if (clickOutsideUserMenu) {
      isUserMenuOpen.value = false;
    }
    if (clickOutsideShowMoreMenu) {
      isShowMore.value = false;
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

  const handleFocus = () => {
    onFocused.value = true;
    if (searchData.value.trim()) {
      isSearchPopupOpen.value = true;
    }
  };

  const handleBlur = () => {
    onFocused.value = false;
  };

  const handleClickAvt = () => {
    isMobileMenuOpen.value = false;
  }

  const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
  }

  const handleLogout = async () => {
    try {
      disconnectAllRooms();
      const response = await getLogout();
      localStorage.removeItem('isLogin');
      localStorage.removeItem('role');
      userStore.clearUserData();
      isMobileMenuOpen.value = false;
      router.push('/');
    } catch (error) {
      console.log(error);
    }
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
      loading.value = true;
      try {
        const response = await searchInformation(newSearchData, 2, 0);
        const data = response.data.data;
        categories.value = data.categories;
        videos.value = data.videos;
        users.value = data.users;
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        loading.value = false;
      }
    } else {
      categories.value = [];
      videos.value = [];
      users.value = [];
      loading.value = false;
    }
  }, 500);

  const fetchPaymentHistory = async () => {
    try {
      const res = await getPaymentHistory();

      if (res.status === 200) {
        if (res.data.data.count > 0) {
          isFirstTime.value = false;
        } else {
          isFirstTime.value = true;
        }
      } else {
        return;
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử thanh toán:', error);
    }
  };

  watch(
    () => searchData.value,
    (newSearchData) => {
      debouncedSearch(newSearchData);
    },
  );

  const performSearch = () => {
    if (searchData.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchData.value.trim() },
      });
      isSearchPopupOpen.value = false;
    }
  };

  // SEARCH

  // NOTIFICATION

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
      <div class="relative flex h-14 items-center justify-between">
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
        <div class="flex items-center w-2/5 justify-center md:items-stretch md:justify-start">
          <div class="hidden md:block">
            <div class="flex space-x-4">
              <RouterLink
                to="/following"
                class="rounded-md px-3 py-2 text_nav hover:bg-primary font-bold"
                aria-current="page"
                v-if="userStore.user"
                >Following</RouterLink
              >
              <RouterLink
                to="/browse/categories"
                class="rounded-md px-3 py-2 text_nav hover:bg-primary font-bold"
                >Browse</RouterLink
              >
              <!-- ------ABOUT US PAGE------------ -->

              <div class="relative flex justify-center items-center" id="show-more-button">
                <div
                  class="relative flex items-center justify-center cursor-pointer mt-1"
                  @click="toggleShowMoreMenu"
                >
                  <div class="font-bold"><i class="pi pi-ellipsis-v"> </i></div>
                </div>
                <div
                  v-if="isShowMore"
                  id="show-more"
                  class="absolute left-0 b z-10 top-10 origin-top-right rounded-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black border-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="show-more-button"
                  tabindex="-1"
                >
                  <ListShowMore @closeAllPopups="closeAllPopups" />
                </div>
              </div>
              <!-- ---------------------------- -->
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/5 h-8 flex md:justify-center items-center ml-[60px]">
          <a href="/"><img class="h-8 w-auto" :src="logo" alt="Madison" /></a>
        </div>
        <div class="w-2/5 items-center justify-end gap-x-6 hidden md:flex">
          <!-- User -->
          <div class="relative w-[262px] min-w-[120px]">
            <InputGroup class="h-[36px] hidden md:flex">
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
              <Button
                icon="pi pi-search text-sm"
                class="btn rounded-s-none"
                @click="performSearch"
              />
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
                :loading="loading"
                :categories="categories"
                :videos="videos"
                :users="users"
                :searchData="searchData"
                @closeAllPopups="closeAllPopups"
              />
            </div>
          </div>

          <!-- Guest -->
          <template v-if="!userStore.user">
            <Button class="btn px-[40px] text-nowrap" @click="openLoginPopup">Log In</Button>
          </template>

          <!-- User -->
          <template v-else>
            <div v-if="userStore.user?.role == 'user' || 'streamer'" class="relative text-sm">
              <div
                v-if="userStore.user?.REPs === 0"
                @click="toggleGetREPsMenu"
                class="rounded-md px-3 py-2 text-gray-300 hover:bg-primary font-bold text-nowrap cursor-pointer"
                id="reps-menu-button"
              >
                Get REP$
              </div>
              <div
                v-else
                @click="toggleGetREPsMenu"
                class="rounded-md px-3 py-2 text-gray-300 bg-primary font-bold text-nowrap cursor-pointer"
                id="reps-menu-button"
              >
                {{ formatView(userStore.user?.REPs) }} REP$
              </div>
              <div
                id="reps-menu"
                class="absolute right-0 z-10 mt-[18px] origin-top-right rounded-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black border-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="reps-menu-button"
                tabindex="-1"
              >
                <GetREPS
                  :isFirstTime="isFirstTime"
                  :isBackVisible="false"
                  v-if="isGetREPsMenuOpen"
                  @toggleGetREPsMenu="toggleGetREPsMenu"
                  @toggleBuyREPs="popupStore.toggleBuyREPs"
                />
              </div>
            </div>

            <template v-if="userStore.user?.role == 'streamer'">
              <div class="relative">
                <div class="cursor-pointer" @click="toggleCreateMenu" id="create-menu-button">
                  <Stream />
                </div>

                <div
                  class="absolute right-0 z-10 mt-6 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
                  v-if="isCreateMenuOpen"
                  id="create-menu"
                >
                  <div class="shadow-lg rounded-md w-[180px]">
                    <div class="px-4 py-5">
                      <div class="flex flex-col gap-y-4 px-1 justify-start text-[13px] text-nowrap">
                        <RouterLink
                          :to="'/streaming/stream-setup'"
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

            <!-- NOTIFICATION -->
            <div class="relative" id="noti-menu-button">
              <div class="relative cursor-pointer" @click="toggleNotiMenu">
                <div class="mt-0.5">
                  <notification fill="fill-white" class="scale-100" />
                </div>
                <div
                  v-if="quantityNotifications > 0"
                  class="absolute top-[-9px] left-3 size-5 bg-[#ef4444] flex justify-center items-center rounded-full text-[11px] border-2 border-white"
                >
                  {{ quantityNotifications }}
                </div>
              </div>
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
                    class="size-[40px] rounded-full object-cover"
                    :src="
                      userStore.user?.Channel
                        ? userStore.user?.Channel?.avatar
                        : userStore.user?.avatar
                    "
                    :alt="userStore.user?.username || 'User'"
                  />
                </button>
              </div>
              <div
                v-if="isUserMenuOpen"
                id="user-menu"
                class="absolute right-0 z-10 mt-[18px] origin-top-right rounded-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black border-none"
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
        <RouterLink
        :to="`/user/${userStore.user.username}`"
        class="flex flex-row gap-x-3 items-center pb-3"
        @click="handleClickAvt"
        v-if="userStore?.user"
      >
        <div class="flex items-center gap-x-2">
          <div class="flex items-center justify-center size-12 rounded-full flex-shrink-0">
          <img
            :src="
              userStore.user?.Channel ? userStore.user?.Channel?.avatar : userStore.user?.avatar
            "
            :alt="userStore.user.username"
            alt="Avatar"
            class="w-full h-full rounded-full object-cover"
          />
        </div>
          <h2 class="text-[17px] font-semibold text-nowrap">{{
            userStore.user?.Channel
              ? userStore.user?.Channel?.channelName
              : userStore.user?.username
          }}</h2>
          <verified v-if="userStore.user?.Channel?.popularCheck" class="fill-blue mt-[-2px]" />
        </div>
      </RouterLink>
        <div class="flex items-center justify-between py-3 gap-x-6">
          <div class="w-[100%]">
            <Button class="btn w-[100%]" v-if="userStore.user?.Channel" @click="popupStore.openUploadVideoPopup">
              <upload />
              <p class="text-nowrap">Upload a video</p>
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
          <RouterLink to="/following"
          @click="handleClickAvt"
          v-if="userStore?.user"
          class="mx-4">Following</RouterLink>
        </a>
        <a
          href="#"
          class="relative flex items-center rounded-md text_nav text-gray-300 hover:bg-gray-700 hover:text-white py-3"
        >
        <RouterLink to="/browse/categories"
          @click="handleClickAvt"
          class="mx-4">Browse</RouterLink>
        </a>
        <div class="relative" v-if="userStore?.user">
          <a
            href="#"
            class="relative flex items-center rounded-md text_nav text-gray-300 hover:bg-gray-700 hover:text-white py-3"
            @click.prevent="toggleDropdown"
          >
            <p class="mx-4">More</p>
            <i class="pi pi-angle-down text-[24px]"></i>
          </a>
          <div
            v-if="isDropdownVisible"
            class="absolute top-full mt-2 w-40 bg-gray-700 text-white rounded-md shadow-md"
          >
            <RouterLink
              v-if="userStore.user.role === 'streamer'"
              to="/dashboard-streamer"
              class="flex flex-row items-center gap-x-2 group cursor-pointer px-8"
              @click="handleClickAvt"
            >
              <Dashboard class="fill-white group-hover:fill-primary" />
              <h1 class="mb-1 group-hover:text-primary">Dashboard</h1>
            </RouterLink>
            <RouterLink
              to="/wallet/payment-method"
              class="flex flex-row items-center gap-x-2 group cursor-pointer"
              @click="handleClickAvt"
            >
              <div class="flex flex-row items-center gap-x-2 group cursor-pointer px-8 mt-3">
                <Wallet class="fill-white group-hover:fill-primary" />
                <h1 class="mb-1 group-hover:text-primary text-nowrap">
                  Wallet ({{ formatNumber(userStore.user?.REPs) ?? 0 }} REPs)
                </h1>
              </div>
            </RouterLink>
            <RouterLink
            to="/personal-profile"
            class="flex flex-row items-center gap-x-2 group cursor-pointer px-8 mt-3"
            @click="handleClickAvt"
            >
            <Setting class="fill-white group-hover:fill-primary" />
            <h1 class="group-hover:text-primary">Setting</h1>
          </RouterLink>
          </div>
        </div>
        <Button class="mx-4 btn px-[40px] text-nowrap mt-5" v-if="userStore?.user" :class="{'mt-[150px]': isDropdownVisible}" @click="handleLogout">Logout</Button>
        <Button class="mx-4 btn px-[40px] text-nowrap mt-5" v-else="userStore?.user" @click="openLoginPopup">Login</Button>
      </div>
      <div class="mx-4">
        <RouterLink
            to="/about-us"
            class="flex flex-row items-center gap-x-2 group cursor-pointer"
            @click="handleClickAvt"
            >
            <h1 class="group-hover:text-primary">About Us</h1>
        </RouterLink>
        <RouterLink
            to="/faq"
            class="flex flex-row items-center gap-x-2 group cursor-pointer mt-3"
            @click="handleClickAvt"
            >
            <h1 class="group-hover:text-primary">FAQ</h1>
        </RouterLink>
        <RouterLink
            to="/community-guidelines"
            class="flex flex-row items-center gap-x-2 group cursor-pointer mt-3"
            @click="handleClickAvt"
            >
            <h1 class="group-hover:text-primary">Community Guidelines</h1>
        </RouterLink>
      </div>
    </div>
  </nav>
  <Login />
  <ForgotPasswordPopup v-model:visible="popupStore.showForgotPasswordPopup" />
  <UploadVideo />
  <VideoDetail />
  <!-- POPUP GET REPS -->
  <CompletePurchase
    title="Complete Purchase"
    :isOpenBuyREPs="popupStore.showOpenBuyREPs"
    @toggleOpenOrder="toggleOpenOrder"
    :isFirstTime="isFirstTime"
  />

  <ProcessingPayment />
  <OrderStatusPopup :isOpenOrder="isOpenOrder" @toggleOpenOrder="toggleOpenOrder" />
</template>

<style>
  .p-inputtext {
    color: #000000 !important;
  }
</style>
