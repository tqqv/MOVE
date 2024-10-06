import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import ResetPassword from '@/pages/ResetPassword.vue';
import StreamerLayout from '@/layouts/StreamerLayout.vue';
import ChannelSetting from '@/components/streamer/channelProfile/ChannelSetting.vue';
import DashboardStreamer from '@/components/streamer/dashboard/DashboardStreamer.vue';
import CommentStreamer from '@/components/streamer/comment/CommentStreamer.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import ProfileContent from '@/components/personalProfile/ProfileContent.vue';
import ViewChannelsContent from '@/components/viewChannels/ViewChannelsContent.vue';
import BrowseContent from '@/components/browse/BrowseContent.vue';
import CategoryDetailsContent from '@/components/CategoryDetails/CategoryDetailsContent.vue';
import SearchContent from '@/components/search/SearchContent.vue';

const routes = [
  // User router
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'personal-profile', component: ProfileContent },
      { path: ':username', component: ViewChannelsContent },
      { path: 'browse', component: BrowseContent },
      { path: 'browse/category', component: CategoryDetailsContent },
      { path: 'search', component: SearchContent },
    ],
  },
  { path: '/reset-password/:token', component: ResetPassword },
  // Streamer router
  {
    path: '/streamer',
    component: StreamerLayout,
    children: [
      { path: '', component: DashboardStreamer },
      { path: 'comments', component: CommentStreamer },
      { path: 'channel-setting', component: ChannelSetting },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
