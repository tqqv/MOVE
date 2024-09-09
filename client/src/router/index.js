import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

import Test from '@pages/Test.vue';
import PersonalProfile from '@pages/PersonalProfile.vue';

const routes = [
  { path: '/', component: Test },
  { path: '/personal-profile', component: PersonalProfile },
];

const router = createRouter({
  // history: createMemoryHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

