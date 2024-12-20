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
import VerifyEmail from '@/components/VerifyEmail.vue';
import ScreenChat from '@/components/screenObs/ScreenChat.vue';
import ScreenDonation from '@/components/screenObs/ScreenDonation.vue';
import ScreenSupportLive from '@/components/screenObs/ScreenSupportLive.vue';
import CashoutHistory from '@/components/streamer/analytics/cashout/CashoutHistory.vue';
import AdvertiseBooking from '@/components/streamer/advertiseBooking/AdvertiseBooking.vue';
import AboutUs from '@/components/showMore/AboutUs.vue';
import FAQ from '@/components/showMore/FAQ.vue';
import CommunityGuidelines from '@/components/showMore/CommunityGuidelines.vue';
import BookingHistory from '@/components/streamer/advertiseBooking/BookingHistory.vue';
import BanPage from '@/pages/BanPage.vue';
import { createPinia, setActivePinia } from 'pinia';
const pinia = createPinia();
setActivePinia(pinia);
import { useUserStore } from '@/stores';

const routes = [
  // User router
  {
    path: '/',
    component: UserLayout,
    meta: { title: 'Move' },
    children: [
      { path: '', component: HomePage },
      {
        path: 'personal-profile',
        component: ProfileContent,
        meta: { roles: ['user', 'streamer'], title: 'Setting Profile' },
      },
      { path: 'user/:username', component: ViewChannelsContent, meta: { title: 'Profile | Move' } },
      {
        path: 'browse',
        component: BrowseContent,
        children: [
          {
            path: 'categories',
            component: TabCategories,
            meta: { title: 'Categories | Browse' },
          },
          { path: 'top-videos', component: TabTopVideo, meta: { title: 'Top Videos | Browse' } },
          { path: 'most_viewed', component: TabMostView, meta: { title: 'Most Viewed | Browse' } },
          {
            path: 'highest_rated',
            component: TabHighestRated,
            meta: { title: 'Highest Rated | Browse' },
          },
        ],
      },
      {
        path: 'wallet',
        component: WalletContent,
        meta: { roles: ['user', 'streamer'] },
        children: [
          {
            path: 'payment-method',
            component: TabPaymentMethod,
            meta: { title: 'Your Wallet | Wallet' },
          },
          {
            path: 'payment-history',
            component: TabPaymentHistory,
            meta: { title: 'Payment History | Wallet' },
          },
        ],
      },
      { path: 'search', component: SearchContent, meta: { title: 'Search' } },
      {
        path: 'following',
        component: Following,
        meta: { roles: ['user', 'streamer'], title: 'Your following' },
      },
      {
        path: 'total-search',
        component: SearchTotal,
        props: (route) => ({
          query: route.query.q,
          type: route.query.type,
        }),
        meta: { title: 'Total Search' },
      },
      { path: 'video/:videoId', component: VideoDetails, meta: { title: 'Video | Move' } },
      {
        path: 'browse/categories/:category',
        component: CategoryDetailsContent,
        meta: { title: 'Category' },
      },
      { path: 'about-us', component: AboutUs, meta: { title: 'About Us' } },
      { path: 'faq', component: FAQ, meta: { title: 'FAQ' } },
      { path: 'community-guidelines', component: CommunityGuidelines, meta: { title: 'Category' } },
    ],
  },
  // LIVE STREAM LAYOUT
  {
    path: '/live/:username',
    component: ViewLiveStreamPage,
    meta: { title: 'Live Stream | Move ' },
  },
  { path: '/reset-password/:token', component: ResetPassword, meta: { title: 'Reset Password' } },
  { path: '/verify-email/:token', component: VerifyEmail, meta: { title: 'Verify Email' } },
  { path: '/banned', component: BanPage, meta: { title: 'Ban | Move' } },
  {
    path: '/overlay',
    component: ScreenSupportLive,
    children: [
      {
        path: ':channelId&type=chatbox',
        component: ScreenChat,
        meta: { title: 'Support Chat | Streamer' },
      },
      {
        path: ':channelId&type=donation',
        component: ScreenDonation,
        meta: { title: 'Support Donation | Streamer' },
      },
    ],
  },
  // Streamer router
  {
    path: '/dashboard-streamer',
    component: StreamerLayout,
    meta: { roles: ['streamer'] },
    children: [
      { path: '', component: DashboardStreamer, meta: { title: 'Dashboard' } },
      {
        path: 'comments',
        component: CommentStreamer,
        meta: { title: 'Manage Comment | Dashboard' },
      },
      {
        path: 'channel-setting',
        component: ChannelSetting,
        meta: { title: 'Setting Channel | Dashboard' },
      },
      { path: 'videos', component: VideoSetting, meta: { title: 'Manage Video | Dashboard' } },
      { path: 'analytics', component: Overview, meta: { title: 'Overview Analytic | Dashboard' } },
      {
        path: 'video-analytics',
        component: VideoAnalytics,
        meta: { title: 'Video Analytic | Dashboard' },
      },
      {
        path: 'video-analytics/:videoId',
        component: InDepthAnalytics,
        meta: { title: 'Video Analytic' },
      },

      {
        path: 'live-stream-analytics',
        component: LiveStreamAnalytics,
        meta: { title: 'Livestream Analytics | Dashboard' },
      },
      {
        path: 'cashout',
        component: Cashout,
        meta: { title: 'Cash Out | Dashboard' },
      },
      {
        path: 'booking-featured',
        component: AdvertiseBooking,
        meta: { title: 'Manage Booking | Dashboard' },
      },
      {
        path: 'booking-history',
        component: BookingHistory,
        meta: { title: 'Booking History | Dashboard' },
      },
      {
        path: 'cashout-history',
        component: CashoutHistory,
        meta: { title: 'Cash Out History | Dashboard' },
      },
    ],
  },
  // Live stream by streamer
  {
    path: '/streaming',
    component: LiveStreamPageByStreamer,
    meta: { roles: ['streamer'] },
    children: [
      { path: 'stream-setup', component: SetUpLive, meta: { title: 'Setup Live' } },
      { path: 'dashboard-live', component: DashboardLive, meta: { title: 'Dashboard Live' } },
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

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || 'Move';
  next();
  const userStore = useUserStore();
  if (!userStore.user) {
    await userStore.fetchUserProfile();
  }

  const userRole = userStore?.user?.role || 'guest';

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next('/404');
  }

  next();
});

export default router;
