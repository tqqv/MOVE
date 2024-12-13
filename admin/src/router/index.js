import { createRouter, createWebHistory } from 'vue-router';
import PageNotFound from '@/pages/PageNotFound.vue';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import UserManagement from '@/components/admin/users/UserManagement.vue';
import RequestManagement from '@/components/admin/request/RequestManagement.vue';
import CategoryManagement from '@/components/admin/category/CategoryManagement.vue';
import LevelworkoutManagement from '@/components/admin/levelworkout/LevelworkoutManagement.vue';
import UserDetail from '@/components/admin/users/UserDetail.vue';
import ReportManagement from '@/components/admin/report/ReportManagement.vue';
import ReportDetail from '@/components/admin/report/ReportDetail.vue';
import AdminSetting from '@/components/admin/setting/AdminSetting.vue';
import Cashout from '@/components/admin/rep/Revenue.vue';
import DonateItem from '@/components/admin/rep/DonateItem.vue';
import DiscountItem from '@/components/admin/rep/DiscountItem.vue';
import LoginAdmin from '@/components/admin/login/LoginAdmin.vue';
// import SystemConfig from '@/components/admin/rep/SystemConfig.vue';

import { createPinia, setActivePinia } from 'pinia';
const pinia = createPinia();
setActivePinia(pinia);
import { useUserStore } from '@/stores';

const routes = [
  {
    path: '/login',
    component: LoginAdmin,
    name: LoginAdmin,
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '/', component: AdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'request', component: RequestManagement },
      { path: 'category', component: CategoryManagement },
      { path: 'levelworkout', component: LevelworkoutManagement },
      { path: 'report', component: ReportManagement },
      { path: 'setting', component: AdminSetting },
      { path: 'reps/Revenue', component: Cashout },
      { path: 'reps/donate', component: DonateItem },
      { path: 'reps/discount', component: DiscountItem },
      // { path: 'system-config', component: SystemConfig },
      { path: 'users/:id', component: UserDetail },
      { path: 'report/:reportType/:reportId', component: ReportDetail },
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
  const userStore = useUserStore();

  if (!userStore.user) {
    try {
      await userStore.fetchUserProfile();
    } catch (error) {
      return next('/login');
    }
  }

  const loggedInUser = userStore.user;

  if (!loggedInUser && to.path !== '/login') {
    return next('/login');
  } else if (loggedInUser && to.path === '/login') {
    return next('/');
  }

  next();
});

export default router;
