<script setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { getAllNotifications, makeAllAsRead } from '@/services/notification';
  import { useNotificationStore } from '@/stores';
  import Skeleton from 'primevue/skeleton';
  import Divider from 'primevue/divider';
  import NotificationItem from './NotificationItem.vue';
  import LogoIcon from '../icons/logoIcon.vue';

  const emit = defineEmits(['toggleNotiMenu']);
  const notificationStore = useNotificationStore();

  const listNotifications = ref([]);
  const loading = ref(false);
  const loadMore = ref(false);
  const page = ref(1);
  const pageSize = ref(6);
  const totalPage = ref();
  const isFetchLoadMore = ref(false);
  const notificationsContainer = ref(null);

  // FETCH ALL
  const fetchListNotifications = async () => {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
    };
    try {
      loading.value = true;
      const response = await getAllNotifications(params);
      listNotifications.value = response.data.data;
      totalPage.value = response.data.data.totalPages;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  // LOAD MORE
  const fetchLoadMore = async () => {
    if (!isFetchLoadMore.value && page.value < totalPage.value) {
      isFetchLoadMore.value = true;
      page.value += 1;
      loadMore.value = true;
      const params = {
        page: page.value,
        pageSize: pageSize.value,
      };
      try {
        const response = await getAllNotifications(params);
        listNotifications.value.notifications.rows.push(...response.data.data.notifications.rows);
      } catch (error) {
        console.log(error);
      } finally {
        isFetchLoadMore.value = false;
        loadMore.value = false;
      }
    }
  };
  // HANDLE SCROLL
  const handleScroll = () => {
    if (notificationsContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = notificationsContainer.value;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchLoadMore();
      }
    }
  };
  // MAKE ALL As READ
  const handleMakeAllAsRead = async () => {
    try {
      const response = await makeAllAsRead();
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      listNotifications.value?.notifications?.rows?.forEach((row) => {
        row.visitStatus?.forEach((statusObj) => {
          if (statusObj.status === 'recieved') {
            statusObj.status = 'visited';
          }
        });
      });
    }
  };

  onMounted(() => {
    fetchListNotifications();
    notificationsContainer.value?.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    notificationsContainer.value?.removeEventListener('scroll', handleScroll);
  });
</script>
<template>
  <div class="shadow-lg rounded-lg w-[340px] bg-white text-black">
    <div class="py-5 text-center relative">
      <h1 class="text_subTitle relative">
        Notifications
        <div class="absolute right-[16px] top-[14%]">
          <div
            class="flex justify-center items-end text-black p-1 hover:bg-gray-light rounded-full cursor-pointer"
            @click="handleOpenSection"
          >
            <i class="pi pi-ellipsis-v text-sm"></i>
          </div>
        </div>
      </h1>
      <div
        class="bg-white absolute w-[80%] ml-9 z-10 rounded-md shadow-xl border border-gray-light p-2"
      >
        <div class="flex flex-col gap-y-1">
          <div
            class="flex items-center gap-x-3 p-2 hover:bg-gray-light rounded-md text-sm font-semibold cursor-pointer"
            @click="handleMakeAllAsRead"
          >
            <i class="pi pi-check"></i>
            <span>Mark all as read</span>
          </div>
          <div
            class="flex items-center gap-x-3 p-2 hover:bg-gray-light rounded-md text-sm font-semibold cursor-pointer"
          >
            <i class="pi pi-cog"></i>
            <span>Notification settings</span>
          </div>
        </div>
      </div>
    </div>
    <Divider class="my-0" />
    <div
      ref="notificationsContainer"
      class="max-h-full p-2 h-[388px] overflow-y-auto overflow-x-hidden scrollbar-custom"
    >
      <div v-if="loading" v-for="n in 4" class="flex items-start gap-x-3 p-3">
        <Skeleton shape="circle" size="2.5rem"></Skeleton>
        <div class="flex flex-col gap-y-2 flex-1">
          <Skeleton width="100%"></Skeleton>
          <Skeleton width="60%"></Skeleton>
          <Skeleton width="30%" height="0.8rem" class="mt-1"></Skeleton>
        </div>
      </div>
      <template
        v-if="!loading"
        v-for="(notification, index) in listNotifications?.notifications?.rows"
        :key="index"
      >
        <NotificationItem :notification="notification" @toggleNotiMenu="emit('toggleNotiMenu')" />
      </template>
      <div v-if="loadMore" class="flex items-start gap-x-3 p-3">
        <Skeleton shape="circle" size="2.5rem"></Skeleton>
        <div class="flex flex-col gap-y-2 flex-1">
          <Skeleton width="100%"></Skeleton>
          <Skeleton width="60%"></Skeleton>
          <Skeleton width="30%" height="0.8rem" class="mt-1"></Skeleton>
        </div>
      </div>
    </div>

    <Divider class="my-0" />

    <div class="flex justify-center">
      <LogoIcon width="30px" />
    </div>
  </div>
</template>
