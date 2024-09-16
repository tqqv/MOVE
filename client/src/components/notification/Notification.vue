<script setup>
  import Divider from 'primevue/divider';
  import NotificationItem from './NotificationItem.vue';
  const notis = [
    {
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      username: 'npmh3102222',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGF2YXRhcnxlbnwwfHx8fDE2MTU4OTU0MjQ&ixlib=rb-1.2.1&q=80&w=400',
      username: 'john_doe',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGF2YXRhcnxlbnwwfHx8fDE2MTU4OTU0MjQ&ixlib=rb-1.2.1&q=80&w=400',
      username: 'jane_doe',
    },
  ];
  const emit = defineEmits(['toogleNotiMenu']);
</script>
<template>
  <div class="shadow-lg rounded-lg w-[340px] bg-black text-white">
    <div class="py-5 text-center">
      <h1 class="text_subTitle text-white relative">
        Notifications
        <i
          class="pi pi-times text-[20px] absolute right-[16px] top-[15%] cursor-pointer"
          @click="emit('toogleNotiMenu')"
        ></i>
      </h1>
    </div>
    <Divider class="my-0" />
    <div class="px-4 py-5">
      <template v-for="(noti, index) in notis" :key="index">
        <NotificationItem :noti="noti" />
        <Divider v-if="index < notis.length - 1" class="mt-0 mb-3" />
      </template>
    </div>
  </div>
</template>
