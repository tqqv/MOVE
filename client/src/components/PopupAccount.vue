<script setup>
  import wallet from '@icons/wallet.vue';
  import verified from '@icons/verified.vue';
  import logout from '@icons/logout.vue';
  import dashboard from '@icons/dashboard.vue';
  import setting from '@icons/setting.vue';
  import { useUserStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import { getLogout } from '@/services/auth';
  import { useRouter } from 'vue-router';

  const userStore = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await getLogout();
      localStorage.removeItem('isLogin');
      userStore.clearUserData();
      toast.success(response.data.message || 'Logout successful!');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data.message || 'Logout failed');
    }
  };
  const props = defineProps({
    isUserMenuOpen: { type: Boolean },
    user: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<template>
  <div class="shadow-lg rounded-md w-[260px]" v-if="props.user">
    <div class="px-4 py-5">
      <div to="/personal-profile" class="flex flex-row gap-x-3 items-center pb-3">
        <img
          :src="props.user.avatar"
          :alt="props.user.username"
          class="rounded-full object-cover size-12"
        />
        <h1 class="text_subTitle whitespace-nowrap">{{ props.user.username }}</h1>
        <verified v-if="props.user.isVerified" class="ml-1 mb-1 fill-blue" />
      </div>
      <hr class="h-px bg-gray-dark border-0 mb-4" />
      <div class="flex flex-col justify-start text-[13px]">
        <div class="flex flex-col gap-y-4 px-1">
          <div class="flex flex-row items-center gap-x-2 group cursor-pointer">
            <dashboard class="fill-black group-hover:fill-primary" />
            <h1 class="mb-1 group-hover:text-primary">Dashboard</h1>
          </div>
          <div class="flex flex-row items-center gap-x-2 group cursor-pointer">
            <wallet class="fill-black group-hover:fill-primary" />
            <h1 class="mb-1 group-hover:text-primary">Wallet ({{ props.user?.REPs ?? 0 }} REPs)</h1>
          </div>
        </div>
        <hr class="h-px bg-gray-dark border-0 my-4" />
        <div class="flex flex-col gap-y-3 px-[2px]">
          <RouterLink
            to="/personal-profile"
            class="flex flex-row items-center gap-x-2 group cursor-pointer"
          >
            <setting class="fill-black group-hover:fill-primary" />
            <h1 class="group-hover:text-primary">Setting</h1>
          </RouterLink>
        </div>
        <hr class="h-px bg-gray-dark border-0 my-4" />
        <div class="flex flex-col gap-y-3 px-1">
          <div
            @click="handleLogout()"
            class="flex flex-row items-center pt-1 gap-x-2 group cursor-pointer"
          >
            <logout class="fill-black group-hover:fill-primary" />
            <h1 class="mb-1 group-hover:text-primary">Logout</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
