import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
const pinia = createPinia();
setActivePinia(pinia);
import { useUserStore } from '@/stores';

// Lazy loading is used to reduce initial bundle size by splitting the code into smaller chunks.
// Each component is loaded only when the route is accessed, creating separate chunks for better performance.
// This avoids loading all components upfront, reducing the initial load time and improving user experience.
// Chunk splitting allows browsers to cache individual chunks, so returning users load faster for previously visited pages.

const routes = [
  // User router
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { title: 'Move' },
    children: [
      { path: '', component: () => import('@/pages/HomePage.vue') },
      {
        path: 'personal-profile',
        component: () => import('@/components/personalProfile/ProfileContent.vue'),
        meta: { roles: ['user', 'streamer'], title: 'Setting Profile' },
      },
      { path: 'user/:username', component: () => import('@/components/viewChannels/ViewChannelsContent.vue'), meta: { title: 'Profile | Move' } },
      {
        path: 'browse',
        component: () => import('@/components/browse/BrowseContent.vue'),
        children: [
          {
            path: 'categories',
            component: () => import('@/components/browse/TabCategories.vue'),
            meta: { title: 'Categories | Browse' },
          },
          { path: 'top-videos', component: () => import('@/components/browse/TabTopVideo.vue'), meta: { title: 'Top Videos | Browse' } },
          { path: 'most_viewed', component: () => import('@/components/browse/TabMostView.vue'), meta: { title: 'Most Viewed | Browse' } },
          {
            path: 'highest_rated',
            component: () => import('@/components/browse/TabHighestRated.vue'),
            meta: { title: 'Highest Rated | Browse' },
          },
        ],
      },
      {
        path: 'wallet',
        component: () => import('@/components/wallet/WalletContent.vue'),
        meta: { roles: ['user', 'streamer'] },
        children: [
          {
            path: 'payment-method',
            component: () => import('@/components/wallet/TabPaymentMethod.vue'),
            meta: { title: 'Your Wallet | Wallet' },
          },
          {
            path: 'payment-history',
            component: () => import('@/components/wallet/TabPaymentHistory.vue'),
            meta: { title: 'Payment History | Wallet' },
          },
        ],
      },
      { path: 'search', component: () => import('@/components/search/SearchContent.vue'), meta: { title: 'Search' } },
      {
        path: 'following',
        component: () => import('@/pages/Following.vue'),
        meta: { roles: ['user', 'streamer'], title: 'Your following' },
      },
      {
        path: 'total-search',
        component: () => import('@/components/search/SearchTotal.vue'),
        props: (route) => ({
          query: route.query.q,
          type: route.query.type,
        }),
        meta: { title: 'Total Search' },
      },
      { path: 'video/:videoId', component: () => import('@/pages/VideoDetails.vue'), meta: { title: 'Video | Move' } },
      {
        path: 'browse/categories/:category',
        component: () => import('@/components/CategoryDetails/CategoryDetailsContent.vue'),
        meta: { title: 'Category' },
      },
      { path: 'about-us', component: () => import('@/components/showMore/AboutUs.vue'), meta: { title: 'About Us' } },
      { path: 'faq', component: () => import('@/components/showMore/FAQ.vue'), meta: { title: 'FAQ' } },
      { path: 'community-guidelines', component: () => import('@/components/showMore/CommunityGuidelines.vue'), meta: { title: 'Category' } },
    ],
  },
  // LIVE STREAM LAYOUT
  {
    path: '/live/:username',
    component: () => import('@/pages/ViewLiveStreamPage.vue'),
    meta: { title: 'Live Stream | Move ' },
  },
  { path: '/reset-password/:token', component: () => import('@/pages/ResetPassword.vue'), meta: { title: 'Reset Password' } },
  { path: '/verify-email/:token', component: () => import('@/components/VerifyEmail.vue'), meta: { title: 'Verify Email' } },
  { path: '/banned', component: () => import('@/pages/BanPage.vue'), meta: { title: 'Ban | Move' } },
  {
    path: '/overlay',
    component: () => import('@/components/screenObs/ScreenSupportLive.vue'),
    children: [
      {
        path: ':channelId&type=chatbox',
        component: () => import('@/components/screenObs/ScreenChat.vue'),
        meta: { title: 'Support Chat | Streamer' },
      },
      {
        path: ':channelId&type=donation',
        component: () => import('@/components/screenObs/ScreenDonation.vue'),
        meta: { title: 'Support Donation | Streamer' },
      },
    ],
  },
  // Streamer router
  {
    path: '/dashboard-streamer',
    component: () => import('@/layouts/StreamerLayout.vue'),
    meta: { roles: ['streamer'] },
    children: [
      { path: '', component: () => import('@/components/streamer/dashboard/DashboardStreamer.vue'), meta: { title: 'Dashboard' } },
      {
        path: 'comments',
        component: () => import('@/components/streamer/comment/CommentStreamer.vue'),
        meta: { title: 'Manage Comment | Dashboard' },
      },
      {
        path: 'channel-setting',
        component: () => import('@/components/streamer/channelProfile/ChannelSetting.vue'),
        meta: { title: 'Setting Channel | Dashboard' },
      },
      { path: 'videos', component: () => import('@/pages/VideoSetting.vue'), meta: { title: 'Manage Video | Dashboard' } },
      { path: 'analytics', component: () => import('@/components/streamer/analytics/overview/Overview.vue'), meta: { title: 'Overview Analytic | Dashboard' } },
      {
        path: 'video-analytics',
        component: () => import('@/components/streamer/analytics/videoAnalytics/VideoAnalytics.vue'),
        meta: { title: 'Video Analytic | Dashboard' },
      },
      {
        path: 'video-analytics/:videoId',
        component: () => import('@/components/streamer/analytics/videoAnalytics/InDepthAnalytics.vue'),
        meta: { title: 'Video Analytic' },
      },

      {
        path: 'live-stream-analytics',
        component: () => import('@/components/streamer/analytics/liveStreamAnalytics/LiveStreamAnalytics.vue'),
        meta: { title: 'Livestream Analytics | Dashboard' },
      },
      {
        path: 'cashout',
        component: () => import('@/components/streamer/analytics/cashout/Cashout.vue'),
        meta: { title: 'Cash Out | Dashboard' },
      },
      {
        path: 'booking-featured',
        component: () => import('@/components/streamer/advertiseBooking/AdvertiseBooking.vue'),
        meta: { title: 'Manage Booking | Dashboard' },
      },
      {
        path: 'booking-history',
        component: () => import('@/components/streamer/advertiseBooking/BookingHistory.vue'),
        meta: { title: 'Booking History | Dashboard' },
      },
      {
        path: 'cashout-history',
        component: () => import('@/components/streamer/analytics/cashout/CashoutHistory.vue'),
        meta: { title: 'Cash Out History | Dashboard' },
      },
    ],
  },
  // Live stream by streamer
  {
    path: '/streaming',
    component: () => import('@/pages/LiveStreamPageByStreamer.vue'),
    meta: { roles: ['streamer'] },
    children: [
      { path: 'stream-setup', component: () => import('@/components/streamer/liveStream/SetUpLive.vue'), meta: { title: 'Setup Live' } },
      { path: 'dashboard-live', component: () => import('@/components/streamer/liveStream/DashboardLive.vue'), meta: { title: 'Dashboard Live' } },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/PageNotFound.vue'),
    name: 'PageNotFound',
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
