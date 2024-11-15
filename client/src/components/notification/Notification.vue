<script setup>
  import Divider from 'primevue/divider';
  import NotificationItem from './NotificationItem.vue';
  import LogoIcon from '../icons/logoIcon.vue';
  const notis = [
    {
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      username: 'npmh3102222',
      contentNoti: 'reacted to your comment',
      read: true,
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGF2YXRhcnxlbnwwfHx8fDE2MTU4OTU0MjQ&ixlib=rb-1.2.1&q=80&w=400',
      username: 'john_doe',
      contentNoti: 'replied to your comment',
      read: false,
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGF2YXRhcnxlbnwwfHx8fDE2MTU4OTU0MjQ&ixlib=rb-1.2.1&q=80&w=400',
      username: 'jane_doe',
      contentNoti: 'follow your channel',

      read: true,
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGF2YXRhcnxlbnwwfHx8fDE2MTU4OTU0MjQ&ixlib=rb-1.2.1&q=80&w=400',
      username: 'jane_doe',
      contentNoti: 'follow your channel',

      read: true,
    },
  ];
  const emit = defineEmits(['toggleNotiMenu']);
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
    <div class="max-h-full p-2 h-[360px] overflow-y-auto overflow-x-hidden scrollbar-custom">
      <template v-for="(noti, index) in notis" :key="index">
        <NotificationItem :noti="noti" />
      </template>
    </div>
    <Divider class="my-0" />

    <div class="flex justify-center">
      <LogoIcon width="30px" />
    </div>
  </div>
</template>
