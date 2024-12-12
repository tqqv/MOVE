<script setup>
  import Divider from 'primevue/divider';
  import NotificationItem from './NotificationItem.vue';
  import LogoIcon from '../icons/logoIcon.vue';
  import { onMounted, ref } from 'vue';
  import { getAllNotifications } from '@/services/notification';
  import { useNotificationStore } from '@/stores';
  import Skeleton from 'primevue/skeleton';

  const emit = defineEmits(['toggleNotiMenu']);
  const notificationStore = useNotificationStore();

  onMounted(() => {
    notificationStore.fetchListNotifications();
  });
</script>
<template>
  <div class="shadow-lg rounded-lg w-[340px] bg-white text-black">
    <div class="py-5 text-center">
      <h1 class="text_subTitle relative">
        Notifications
        <div class="absolute right-[16px] top-[14%]">
          <div
            class="flex justify-center items-end text-black p-1 hover:bg-gray-light rounded-full cursor-pointer"
            @click="emit('toggleNotiMenu')"
          >
            <i class="pi pi-times text-sm"></i>
          </div>
        </div>
      </h1>
    </div>
    <Divider class="my-0" />
    <div v-if="notificationStore.loading" class="max-h-full p-2">
      <div v-for="n in 4" class="flex items-start gap-x-3 p-3">
        <Skeleton shape="circle" size="3rem"></Skeleton>
        <div class="flex flex-col gap-y-2 flex-1">
          <Skeleton width="100%"></Skeleton>
          <Skeleton width="60%"></Skeleton>
          <Skeleton width="30%" height="0.8rem" class="mt-1"></Skeleton>
        </div>
      </div>
    </div>
    <div v-else class="max-h-full p-2 h-[388px] overflow-y-auto overflow-x-hidden scrollbar-custom">
      <template
        v-for="(notification, index) in notificationStore.listNotifications?.notifications"
        :key="index"
      >
        <NotificationItem :notification="notification" />
      </template>
    </div>
    <Divider class="my-0" />

    <div class="flex justify-center">
      <LogoIcon width="30px" />
    </div>
  </div>
</template>
