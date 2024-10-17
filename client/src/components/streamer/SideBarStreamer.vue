<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import HomeIcon from '@icons/home.vue';
  import VideoIcon from '@icons/videos.vue';
  import CommentIcon from '@icons/comment.vue';
  import AnalyticsIcon from '@icons/analytics.vue';
  import CashoutIcon from '@icons/cashout.vue';
  import SettingIcon from '@icons/setting.vue';

  const route = useRoute();
  const isDropdownOpen = ref(false);

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const menuItems = [
    { name: 'Home', icon: HomeIcon, link: '/streamer' },
    { name: 'Video', icon: VideoIcon, link: '/streamer/videos' },
    { name: 'Comments', icon: CommentIcon, link: '/streamer/comments' },
    {
      name: 'Analytics',
      icon: AnalyticsIcon,
      link: '/streamer/analytics',
      hasDropdown: true,
      submenu: [
        { name: 'Overview', link: '/streamer/analytics' },
        { name: 'Video analytics', link: '/streamer/video-analytics' },
        { name: 'Live analytics', link: '/streamer/live-analytics' },
      ],
    },
    { name: 'Cashout', icon: CashoutIcon, link: '/streamer/cashout' },
    { name: 'Channel settings', icon: SettingIcon, link: '/streamer/channel-setting' },
  ];
</script>

<template>
  <div
    class="sticky top-[72px] h-[calc(100vh-72px)] w-[261px] border-r-2 border-gray-dark bg-white"
  >
    <div class="flex flex-col py-3">
      <ul>
        <li v-for="item in menuItems" :key="item.name" class="block mx-2 mb-1">
          <router-link :to="item.link" class="block">
            <div
              class="p-4 cursor-pointer group hover:bg-primary/20 flex gap-x-4 font-semibold items-center rounded-md"
              :class="{ 'bg-primary/85 font-bold hover:bg-primary/85': route.path === item.link }"
              @click="item.hasDropdown && toggleDropdown()"
            >
              <component :is="item.icon" />
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
                  class="p-2 cursor-pointer group hover:bg-primary/20 flex items-center rounded-md"
                  :class="{
                    ' font-bold hover:bg-primary/20': route.path === subitem.link,
                  }"
                >
                  <p class="text-sm">{{ subitem.name }}</p>
                </div>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
