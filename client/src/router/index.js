import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import Test from '@pages/Test.vue';
import PersonalProfile from '@pages/PersonalProfile.vue';
import ViewChannels from '@/pages/ViewChannels.vue';
import ResetPassword from '@/pages/ResetPassword.vue';
import StreamerLayout from '@/pages/StreamerLayout.vue';
import ChannelSetting from '@/components/streamer/channelProfile/ChannelSetting.vue';
import DashboardStreamer from '@/components/streamer/dashboard/DashboardStreamer.vue';
import CommentStreamer from '@/components/streamer/comment/CommentStreamer.vue';
import CategoryDetails from '@/pages/CategoryDetails.vue';
import Browse from '@/pages/Browse.vue';

const routes = [
  { path: '/', component: Test },
  { path: '/personal-profile', component: PersonalProfile },
  { path: '/view-channels', component: ViewChannels },
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/browse', component: Browse },
  // { path: '/browse/:category', component: CategoryDetails },
  //Có api thì fix lại
  { path: '/browse/category', component: CategoryDetails },
  // Streamer router
  {
    path: '/streamer',
    component: StreamerLayout,
    children: [
      { path: 'home', component: DashboardStreamer },
      { path: 'comments', component: CommentStreamer },

      { path: 'channel-setting', component: ChannelSetting },
    ],
  },
];

const router = createRouter({
  // history: createMemoryHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
