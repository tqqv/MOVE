<script setup>
  import verified from '@icons/verified.vue';
  import logout from '@icons/logout.vue';
  import { useUserStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import { getLogout } from '@/services/auth';
  import { useRouter } from 'vue-router';
  import { formatNumber } from '@/utils';
  const emit = defineEmits(['closeAllPopups']);

  const userStore = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await getLogout();
      localStorage.removeItem('isLoginAdmin');
      localStorage.removeItem('role');
      userStore.clearUserData();

      toast.success(response?.data.message || 'Logout successful!');
      emit('closeAllPopups');
      router.push('/login');
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

  const showToast = () => {
    toast.info('You are not a streamer');
    emit('closeAllPopups');
  };
</script>

<template>
  <div class="shadow-lg rounded-md w-[260px]" v-if="props.user">
    <div class="px-4 py-5">
      <RouterLink
        :to="`/user/${props.user.username}`"
        class="flex flex-row gap-x-3 items-center pb-3"
        @click="emit('closeAllPopups')"
      >
        <div class="flex items-center justify-center size-12 rounded-full flex-shrink-0">
          <img
            :src="
              userStore.user?.Channel ? userStore.user?.Channel?.avatar : userStore.user?.avatar
            "
            :alt="props.user.username"
            alt="Avatar"
            class="w-full h-full rounded-full object-cover"
          />
        </div>
        <h1 class="text_subTitle whitespace-nowrap">
          {{
            userStore.user?.Channel
              ? userStore.user?.Channel?.channelName
              : userStore.user?.username
          }}
        </h1>
        <verified v-if="props.user.isVerified" class="ml-1 mb-1 fill-blue" />
      </RouterLink>
      <hr class="h-px bg-gray-dark border-0 mb-4" />
      <div class="flex flex-col justify-start text-[13px]">
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
