import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import Test from '@pages/Test.vue';
import PersonalProfile from '@pages/PersonalProfile.vue';
import ViewChannels from '@/pages/ViewChannels.vue';
import ResetPassword from '@/pages/ResetPassword.vue';
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
];

const router = createRouter({
  // history: createMemoryHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
