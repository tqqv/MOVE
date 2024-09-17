import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import Test from '@pages/Test.vue';
import PersonalProfile from '@pages/PersonalProfile.vue';
<<<<<<< HEAD
import ViewChannels from '@/pages/ViewChannels.vue';
=======
import ResetPassword from '@/pages/ResetPassword.vue';
>>>>>>> 25d78442dfa9360f8b50599a49218046f5b09047

const routes = [
  { path: '/', component: Test },
  { path: '/personal-profile', component: PersonalProfile },
<<<<<<< HEAD
  { path: '/view-channels', component: ViewChannels },
=======
  { path: '/reset-password/:token', component: ResetPassword },
>>>>>>> 25d78442dfa9360f8b50599a49218046f5b09047
];

const router = createRouter({
  // history: createMemoryHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
