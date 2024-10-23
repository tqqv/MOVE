<script setup>
  import { useRoute } from 'vue-router';
  import HomeIcon from '@icons/home.vue';
  import VideoIcon from '@icons/videos.vue';
  import CommentIcon from '@icons/comment.vue';
  import AnalyticsIcon from '@icons/analytics.vue';
  import CashoutIcon from '@icons/cashout.vue';
  import SettingIcon from '@icons/setting.vue';

  const route = useRoute();

  const menuItems = [
    { name: 'Home', icon: HomeIcon, link: '/dashboard-streamer' },
    { name: 'Video', icon: VideoIcon, link: '/dashboard-streamer/videos' },
    { name: 'Comments', icon: CommentIcon, link: '/dashboard-streamer/comments' },
    { name: 'Analytics', icon: AnalyticsIcon, link: '/dashboard-streamer/analytics' },
    { name: 'Cashout', icon: CashoutIcon, link: '/dashboard-streamer/cashout' },
    { name: 'Channel settings', icon: SettingIcon, link: '/dashboard-streamer/channel-setting' },
  ];
</script>
<template>
  <div
    class="sticky top-[72px] h-[calc(100vh-72px)] w-[261px] border-r-2 border-gray-dark bg-white"
  >
    <div class="flex flex-col py-3">
      <ul>
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.link"
          class="block mx-2 mb-1"
        >
          <li
            class="p-4 cursor-pointer group hover:bg-primary/20 flex gap-x-4 font-semibold items-center rounded-md"
            :class="{ 'bg-primary/85 font-bold hover:bg-primary/85': route.path === item.link }"
          >
            <component :is="item.icon" />
            <p class="text-sm">{{ item.name }}</p>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>
