<script setup>
  import HomeIcon from '@icons/home.vue';
  import VideoIcon from '@icons/videos.vue';
  import CommentIcon from '@icons/comment.vue';
  import AnalyticsIcon from '@icons/analytics.vue';
  import CashoutIcon from '@icons/cashout.vue';
  import SettingIcon from '@icons/setting.vue';

  const menuItems = [
    {
      name: 'Home',
      icon: HomeIcon,
      link: '/home',
    },
    {
      name: 'Video',
      icon: VideoIcon,
      link: '/video',
    },
    {
      name: 'Comment',
      icon: CommentIcon,
      link: '/comment',
    },
    {
      name: 'Analytics',
      icon: AnalyticsIcon,
      link: '/analytics',
    },
    {
      name: 'Cashout',
      icon: CashoutIcon,
      link: '/logout',
    },
    {
      name: 'Channel settings',
      icon: SettingIcon,
      link: '/profile-settings',
    },
  ];
</script>
<template>
  <div
    class="hidden min-h-screen md:block border-r-2 border-gray-dark transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col w-[241px] py-3">
      <ul>
        <li
          class="px-4 py-3 mb-1 cursor-pointer group hover:bg-primary-light/25"
          v-for="item in menuItems"
          :key="item.name"
        >
          <div class="flex gap-x-4 font-semibold items-center">
            <!-- <i :class="['pi text-xl', item.icon]"></i> -->
            <component class="" :is="item.icon" />
            <p>{{ item.name }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
