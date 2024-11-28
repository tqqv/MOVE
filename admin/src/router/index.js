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
import Cashout from '@/components/admin/rep/Cashout.vue';
import DonateItem from '@/components/admin/rep/DonateItem.vue';
import DiscountItem from '@/components/admin/rep/DiscountItem.vue';

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'request', component: RequestManagement },
      { path: 'category', component: CategoryManagement },
      { path: 'levelworkout', component: LevelworkoutManagement },
      { path: 'report', component: ReportManagement },
      { path: 'setting', component: AdminSetting },
      { path: 'reps/cashout', component: Cashout },
      { path: 'reps/donate', component: DonateItem },
      { path: 'reps/discount', component: DiscountItem },
      { path: 'users/:username', component: UserDetail },
      { path: 'report/:reportId', component: ReportDetail },
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