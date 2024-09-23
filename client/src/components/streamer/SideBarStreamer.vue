<script setup>
  import { useRoute } from 'vue-router';
  import HomeIcon from '@icons/home.vue';
  import VideoIcon from '@icons/videos.vue';
  import CommentIcon from '@icons/comment.vue';
  import AnalyticsIcon from '@icons/analytics.vue';
  import CashoutIcon from '@icons/cashout.vue';
  import SettingIcon from '@icons/setting.vue';

  const route = useRoute();
  console.log(route.path);

  const menuItems = [
    { name: 'Home', icon: HomeIcon, link: '/streamer/home' },
    { name: 'Video', icon: VideoIcon, link: '/streamer/video' },
    { name: 'Comments', icon: CommentIcon, link: '/streamer/comments' },
    { name: 'Analytics', icon: AnalyticsIcon, link: '/streamer/analytics' },
    { name: 'Cashout', icon: CashoutIcon, link: '/streamer/cashout' },
    { name: 'Channel settings', icon: SettingIcon, link: '/streamer/channel-setting' },
  ];
</script>
<template>
  <div
    class="hidden h-[calc(100vh-72px)] md:block border-r-2 border-gray-dark sticky top-[72px] transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col w-[261px] py-3">
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
            <p>{{ item.name }}</p>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>
