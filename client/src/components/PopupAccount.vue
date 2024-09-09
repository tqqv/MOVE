<script setup>
  import wallet from '@icons/wallet.vue';
  import verified from '@icons/verified.vue';
  import logout from '@icons/logout.vue';
  import dashboard from '@icons/dashboard.vue';
  import setting from '@icons/setting.vue';

  const user = {
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    username: 'npmh310',
    REPs: 10,
    verified: true,
  };
  // TRUYEN PROPS
  //   const props = defineProps({
  //   user: {
  //     type: Object,
  //     required: true
  //   }
  // });
</script>

<template>
  <div class="shadow-lg rounded-md w-[260px]">
    <div class="px-4 py-5">
      <div class="flex flex-row gap-x-3 items-center pb-3">
        <img :src="user.avatar" alt="avatar people" class="rounded-full object-cover size-12" />
        <h1 class="text_subTitle">{{ user.username }}</h1>
        <verified v-if="user.verified" class="ml-1 mb-1 fill-blue" />
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
            <h1 class="mb-1 group-hover:text-primary">Wallet ({{ user.REPs }} REPs)</h1>
          </div>
        </div>
        <hr class="h-px bg-gray-dark border-0 my-4" />
        <div class="flex flex-col gap-y-3 px-[2px]">
          <div class="flex flex-row items-center gap-x-2 group cursor-pointer">
            <setting class="fill-black group-hover:fill-primary" />
            <h1 class="group-hover:text-primary">Setting</h1>
          </div>
        </div>
        <hr class="h-px bg-gray-dark border-0 my-4" />
        <div class="flex flex-col gap-y-3 px-1">
          <div class="flex flex-row items-center pt-1 gap-x-2 group cursor-pointer">
            <logout class="fill-black group-hover:fill-primary" />
            <h1 class="mb-1 group-hover:text-primary">Logout</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
