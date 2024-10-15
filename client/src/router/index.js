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
import LiveStreamPage from '@/pages/LiveStreamPage.vue';
import SetUpLive from '@/components/streamer/liveStream/SetUpLive.vue';
import DashboardLive from '@/components/streamer/liveStream/DashboardLive.vue';
import VideoDetails from '@/pages/VideoDetails.vue';
import VideoSetting from '@/pages/VideoSetting.vue';
import PageNotFound from '@/pages/PageNotFound.vue';
import TabCategories from '@/components/browse/TabCategories.vue';
import TabHighestRated from '@/components/browse/TabHighestRated.vue';
import TabTopVideo from '@/components/browse/TabTopVideo.vue';
import TabMostView from '@/components/browse/TabMostView.vue';

const routes = [
  // User router
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'personal-profile', component: ProfileContent },
      { path: ':username', component: ViewChannelsContent },
      {
        path: 'browse',
        component: BrowseContent,
        children: [
          { path: 'categories', component: TabCategories },
          { path: 'top-videos', component: TabTopVideo },
          { path: 'most-viewed', component: TabMostView },
          { path: 'highest-rated', component: TabHighestRated },
        ],
      },
      { path: 'search', component: SearchContent },
      { path: 'video/:videoId', component: VideoDetails },
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
      { path: 'videos', component: VideoSetting },
    ],
  },
  // Live stream
  {
    path: '/live',
    component: LiveStreamPage,
    children: [
      { path: 'stream-setup', component: SetUpLive },
      { path: 'dashboard-live', component: DashboardLive },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
