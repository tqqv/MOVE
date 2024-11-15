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
import LiveStreamPageByStreamer from '@/pages/LiveStreamPageByStreamer.vue';
import SetUpLive from '@/components/streamer/liveStream/SetUpLive.vue';
import DashboardLive from '@/components/streamer/liveStream/DashboardLive.vue';
import VideoDetails from '@/pages/VideoDetails.vue';
import VideoSetting from '@/pages/VideoSetting.vue';
import PageNotFound from '@/pages/PageNotFound.vue';
import TabCategories from '@/components/browse/TabCategories.vue';
import TabHighestRated from '@/components/browse/TabHighestRated.vue';
import TabTopVideo from '@/components/browse/TabTopVideo.vue';
import TabMostView from '@/components/browse/TabMostView.vue';
import Overview from '@/components/streamer/analytics/overview/Overview.vue';
import VideoAnalytics from '@/components/streamer/analytics/videoAnalytics/VideoAnalytics.vue';
import ViewLiveStreamPage from '@/pages/ViewLiveStreamPage.vue';
import InDepthAnalytics from '@/components/streamer/analytics/videoAnalytics/InDepthAnalytics.vue';
import WalletContent from '@/components/wallet/WalletContent.vue';
import TabPaymentMethod from '@/components/wallet/TabPaymentMethod.vue';
import TabPaymentHistory from '@/components/wallet/TabPaymentHistory.vue';
import Following from '@/pages/Following.vue';
import SearchTotal from '@/components/search/SearchTotal.vue';
import Cashout from '@/components/streamer/analytics/cashout/Cashout.vue';
import LiveStreamAnalytics from '@/components/streamer/analytics/liveStreamAnalytics/LiveStreamAnalytics.vue';


const routes = [
  // User router
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'personal-profile', component: ProfileContent },
      { path: 'user/:username', component: ViewChannelsContent },

      {
        path: 'browse',
        component: BrowseContent,
        children: [
          {
            path: 'categories',
            component: TabCategories,
          },
          { path: 'top-videos', component: TabTopVideo },
          { path: 'most_viewed', component: TabMostView },
          { path: 'highest_rated', component: TabHighestRated },
        ],
      },
      {
        path: 'wallet',
        component: WalletContent,
        children: [
          { path: 'payment-method', component: TabPaymentMethod },
          { path: 'payment-history', component: TabPaymentHistory },
        ],
      },
      { path: 'search', component: SearchContent },
      { path: 'following', component: Following },
      {
        path: 'total-search',
        component: SearchTotal,
        props: (route) => ({
          query: route.query.q,
          type: route.query.type,
        }),
      },
      { path: 'video/:videoId', component: VideoDetails },
      { path: 'browse/categories/:category', component: CategoryDetailsContent },
    ],
  },
  // LIVE STREAM LAYOUT
  { path: '/live/:username', component: ViewLiveStreamPage },
  { path: '/reset-password/:token', component: ResetPassword },
  // Streamer router
  {
    path: '/dashboard-streamer',
    component: StreamerLayout,
    children: [
      { path: '', component: DashboardStreamer },
      { path: 'comments', component: CommentStreamer },
      { path: 'channel-setting', component: ChannelSetting },
      { path: 'videos', component: VideoSetting },
      { path: 'analytics', component: Overview },
      { path: 'video-analytics', component: VideoAnalytics },
      { path: 'video-analytics/:videoId', component: InDepthAnalytics },
      { path: 'cashout', component: Cashout },
      { path: 'live-stream-analytics', component: LiveStreamAnalytics },
    ],
  },
  // Live stream by streamer
  {
    path: '/streaming',
    component: LiveStreamPageByStreamer,
    children: [
      { path: 'stream-setup', component: SetUpLive },
      { path: 'dashboard-live', component: DashboardLive },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
    name: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
