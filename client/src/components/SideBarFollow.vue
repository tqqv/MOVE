<script setup>
  import { watch, ref } from 'vue';
  import { useUserStore } from '@/stores/user.store';
  import { usePopupStore } from '@/stores';
  import { useTabStore } from '@/stores/tab.store';

  import logoIcon from '@icons/logoIcon.vue';
  import verified from '@icons/verified.vue';
  import Button from 'primevue/button';

  const userStore = useUserStore();
  const popupStore = usePopupStore();
  const tabStore = useTabStore();

  const isShow = ref(true);

  const handleShow = () => {
    isShow.value = !isShow.value;
  };

  const openLoginPopup = () => {
    popupStore.openLoginPopup();
    tabStore.setActiveTab('1');
  };
  watch(
    () => userStore.followers,
    (newFollowers) => {},
  );
</script>

<template>
  <!-- SHOW -->
  <div
    v-if="isShow"
    class="hidden md:block sticky top-[72px] h-[calc(100vh-72px)] w-[251px] border-r-2 border-gray-dark bg-white transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col p-4">
      <div class="flex items-center my-1 justify-between">
        <h2 class="uppercase text_subTitle text-[14px]">follow channels</h2>
        <i
          class="pi pi-arrow-left cursor-pointer text-[16px] p-2 rounded-full hover:bg-primary-light/30"
          style="font-weight: 800"
          @click="handleShow"
        ></i>
      </div>
      <!-- NOT LOG IN -->
      <div
        v-if="!userStore.user"
        class="flex flex-col justify-center px-3 py-5 mt-4 rounded-md bg-primary text-center"
      >
        <div class="flex justify-center"><logoIcon fill="black" /></div>
        <h1 class="text_subTitle text-white mt-2 mb-1">Join MOVE!</h1>
        <p class="text-xs mb-6 text-black/80">Sign up now to follow your favorite instructor!</p>
        <Button
          class="w-full border-none bg-white text-primary font-bold px-[40px] text-nowrap"
          @click="openLoginPopup"
          >Sign up</Button
        >
      </div>
      <div class="flex flex-col gap-y-4 my-5">
        <!-- NONE FOLLOWING CHANNEL -->
        <div
          v-if="userStore.followers.length === 0 && userStore.user"
          class="flex flex-col justify-center mt-4"
        >
          <p class="mb-3 text-sm text-body">You have not followed any instructors yet.</p>
          <RouterLink
            to="/browse/categories"
            class="rounded-lg block w-1/2 text-center text-white px-3 py-2 text-gray-300 bg-primary font-bold"
            >Browse</RouterLink
          >
        </div>

        <!-- HAVE FOLLOWING CHANNEL -->
        <RouterLink
          v-if="userStore.followers.length && userStore.user"
          v-for="userFollower in userStore.followers"
          :key="userFollower.id"
          class="flex items-center gap-x-3 cursor-pointer"
          :to="`/user/${userFollower.followChannel.User.username}`"
        >
          <div
            :class="[
              'flex items-center justify-center size-14 rounded-full p-[2px] flex-shrink-0',
              userFollower.followChannel.isLive
                ? 'border-[3px] border-red'
                : 'border-[3px] border-transparent',
            ]"
          >
            <img
              :src="userFollower.followChannel?.avatar || 'default-avatar.png'"
              alt="Avatar"
              class="size-11 rounded-full object-cover p-[1.5px]"
            />
          </div>

          <div class="flex flex-col gap-y-1 truncate">
            <div class="flex flex-row gap-x-3">
              <p class="text_para truncate">
                {{ userFollower.followChannel?.channelName }}
              </p>
              <verified v-if="userFollower.followChannel.popularCheck" class="mx-1 fill-blue" />
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
              <p class="">{{ userFollower.followChannel.followCount }} followers</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
  <!-- HIDDEN -->
  <div
    v-else
    class="hidden md:block sticky top-[72px] h-[calc(100vh-72px)] w-[80px] border-2 border-gray-dark transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col px-2">
      <div
        class="flex items-center justify-center hover:bg-gray-light rounded-md my-2 py-5 px-3 cursor-pointer"
        v-tooltip="'Expand sidebar '"
        @click="handleShow"
      >
        <i class="pi pi-arrow-right text-[16px]" style="font-weight: 800"></i>
      </div>
      <!-- NOT LOG IN -->
      <div v-if="!userStore.user" class="flex justify-center mt-4 rounded-md">
        <div
          v-tooltip="'Sign up'"
          class="flex items-center w-full justify-center hover:bg-primary-light/20 rounded-md py-5 px-3 cursor-pointer"
          @click="openLoginPopup"
        >
          <i class="pi pi-sign-in"></i>
        </div>
      </div>
      <!-- NOTE FOLLOWING CHANNEL -->
      <RouterLink
        v-if="userStore.followers.length === 0 && userStore.user"
        v-tooltip="'Browse'"
        class="flex justify-center items-center py-[18px] px-6 mt-4 rounded-md cursor-pointer hover:bg-primary/20 text-center"
        to="/browse/categories"
      >
        <i class="pi pi-th-large"></i>
      </RouterLink>
      <div class="flex flex-col gap-y-2 my-2 items-center">
        <RouterLink
          v-for="userFollower in userStore.followers"
          v-tooltip="userFollower.followChannel.channelName"
          :key="userFollower.id"
          class="flex items-center justify-center gap-x-3 cursor-pointer hover:bg-primary-light/20 rounded-md py-2 px-3"
          :to="`/user/${userFollower.followChannel.User.username}`"
        >
          <div
            :class="[
              'flex items-center justify-center border-[3px] rounded-full flex-shrink-0 ',
              userFollower.followChannel.isLive ? ' border-red' : 'border-transparent',
            ]"
          >
            <img
              :src="userFollower.followChannel?.avatar || 'default-avatar.png'"
              alt="Avatar"
              class="size-10 rounded-full object-cover p-[1.5px]"
            />
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style></style>
