<script setup>
  import wallet from '@icons/wallet.vue';
  import verified from '@icons/verified.vue';
  import logout from '@icons/logout.vue';
  import dashboard from '@icons/dashboard.vue';

  const user = {
    avatar:
      'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-1/449833626_122215725842002441_4511415059026978796_n.jpg?stp=cp6_dst-jpg_s160x160&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=AWcYzbvwetsQ7kNvgGIM5Qa&_nc_ht=scontent.fdad1-4.fna&_nc_gid=AHTvQKUNgNJc-Bosh9Y8rgW&oh=00_AYD5NlUqr1jJ_L46lmaGJn_EiECuZXWj5hLM_ku6YqPgfw&oe=66D48B72',
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
      <div class="flex flex-row gap-x-3 items-center py-3">
        <img :src="user.avatar" alt="avatar people" class="rounded-full object-cover w-12 h-12" />

        <h1 class="text_subTitle">{{ user.username }}</h1>
        <verified v-if="user.verified" class="ml-1 mb-1 fill-blue" />
      </div>
      <hr class="h-px bg-gray-dark border-0 mb-4" />

      <div class="flex flex-col justify-start text-[13px] px-1">
        <div class="flex flex-col gap-y-4">
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
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-row items-center gap-x-2 group cursor-pointer">
            <i class="pi pi-cog group-hover:text-primary" style="font-size: 1.5rem"></i>
            <h1 class="group-hover:text-primary">Setting</h1>
          </div>
        </div>
        <hr class="h-px bg-gray-dark border-0 my-4" />
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-row items-center pt-1 gap-x-2 group cursor-pointer">
            <logout class="fill-black group-hover:fill-primary" />
            <h1 class="mb-1 group-hover:text-primary">Logout</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
