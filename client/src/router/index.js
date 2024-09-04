import { createMemoryHistory, createRouter } from 'vue-router';

import Test from '@pages/Test.vue';

const routes = [{ path: '/', component: Test }];

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
