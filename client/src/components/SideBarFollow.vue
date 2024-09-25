<script setup>
  import { onMounted, ref } from 'vue';
  import verified from '@icons/verified.vue';
  import { useUserStore } from '@/stores/user.store';

  const userStore = useUserStore();

  // xu ly show va hidden sidebar
  const isShow = ref(true);

  const handleShow = () => {
    isShow.value = !isShow.value;
  };

  onMounted(async () => {
    await userStore.loadFollowers();
  });
</script>

<template>
  <!-- SHOW -->
  <div
    v-if="isShow"
    class="hidden min-h-[calc(100vh-72px)] md:block border-r-2 border-gray-dark transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col w-[241px] px-4 py-4">
      <div class="flex items-center justify-between">
        <h2 class="uppercase text_subTitle text-[13px]">follow channels</h2>
        <i
          class="pi pi-arrow-left cursor-pointer text-[19px]"
          style="font-weight: 800"
          @click="handleShow"
        ></i>
      </div>
      <div class="flex flex-col gap-y-4 my-5">
        <div
          v-for="userFollower in userStore.followers"
          :key="userFollower.id"
          class="flex items-center gap-x-3 cursor-pointer"
        >
          <div
            :class="[
              'flex items-center justify-center  w-12 h-12 rounded-full',
              userFollower.isStreaming ? 'border-[3px] border-red' : '',
            ]"
          >
            <img
              :src="userFollower.subscribeChannel?.avatar || 'default-avatar.png'"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover p-[1.5px]"
            />
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex flex-row gap-x-3">
              <p class="text_para">{{ userFollower.subscribeChannel?.channelName }}</p>
              <verified v-if="userFollower.verified" class="ml-1 mb-1 fill-blue" />
            </div>
            <div
              v-if="userFollower.isStreaming"
              class="flex flex-row text_secondary text-body text-[12px] gap-x-1"
            >
              <p>Just move</p>
              •
              <p class="">{{ userFollower.viewers }} viewers</p>
            </div>
            <!-- STREAMING FASLE NÈ-->
            <div v-else class="flex flex-row text_secondary text-body text-[12px] gap-x-2">
              <p class="">{{ userFollower.totalVideos }} videos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- HIDDEN -->
  <div
    v-else
    class="hidden md:block w-[89px] border-2 border-gray-dark transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col px-4 py-4">
      <div class="flex items-center justify-center">
        <i
          class="pi pi-align-right cursor-pointer text-[19.5px]"
          style="font-weight: 800"
          @click="handleShow"
        ></i>
      </div>
      <div class="flex flex-col gap-y-4 my-5">
        <div
          v-for="userFollower in userStore.followers"
          :key="userFollower.id"
          class="flex items-center gap-x-3 cursor-pointer"
        >
          <div
            :class="[
              'relative inline-flex items-center justify-center w-12 h-12 rounded-full p-0.5',
              userFollower.isStreaming ? 'border-[3px] border-red' : '',
            ]"
          >
            <img
              :src="userFollower.subscribeChannel?.avatar"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
