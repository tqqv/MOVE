<script setup>
  import { watch, ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/user.store';
  import { usePopupStore } from '@/stores';
  import { useTabStore } from '@/stores/tab.store';

  import logoIcon from '@icons/logoIcon.vue';
  import verified from '@icons/verified.vue';
  import Button from 'primevue/button';
  import User from './icons/user.vue';
  import Category from './icons/category.vue';

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
    class="hidden md:block sticky top-[64px] h-[calc(100vh-64px)] w-[241px] border-r-2 border-gray-dark bg-white transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col pt-2 h-full">
      <div class="flex items-center my-1 justify-between px-3">
        <h2 class="uppercase text_subTitle text-[16px]">for you</h2>
        <i
          class="pi pi-arrow-left cursor-pointer text-[16px] p-2 rounded-full hover:bg-primary-light/30"
          style="font-weight: 800"
          @click="handleShow"
        ></i>
      </div>
      <!-- NOT LOG IN -->
      <div
        v-if="!userStore.user"
        class="flex flex-col justify-center px-3 py-5 mt-4 rounded-md bg-primary text-center mx-3"
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
      <!-- NONE FOLLOW ANYTHING -->
      <div
        v-if="
          userStore.followers.length === 0 &&
          userStore.followCategories.length === 0 &&
          userStore.user
        "
        class="flex flex-col justify-center mt-3 px-3"
      >
        <p class="mb-3 text-sm text-body">You have not followed any streamer or categories yet.</p>
        <RouterLink
          to="/browse/categories"
          class="rounded-lg block w-1/2 text-center text-white px-3 py-2 text-gray-300 bg-primary font-bold"
          >Browse</RouterLink
        >
      </div>
      <div class="flex flex-col gap-y-2 h-full overflow-y-auto scrollbar-custom px-3 mr-0.5">
        <!-- HAVE FOLLOWING CHANNEL -->
        <div v-if="userStore.followers.length && userStore.user" class="flex flex-col mt-2 gap-y-2">
          <p class="mb-3 text-body font-semibold">Follow channel</p>
          <RouterLink
            v-if="userStore.followers.length"
            v-for="userFollower in userStore.followers"
            :key="userFollower.id"
            class="flex items-center justify-start gap-x-2 cursor-pointer hover:bg-primary-light/20 rounded-md p-1"
            :to="
              userFollower.followChannel?.isLive
                ? `/live/${userFollower.followChannel?.User?.username}`
                : `/user/${userFollower.followChannel?.User?.username}`
            "
          >
            <div
              :class="[
                'flex items-center justify-center size-[44px] rounded-full p-[2px] flex-shrink-0',
                userFollower.followChannel.isLive ? 'border-[3px] border-red' : '',
              ]"
            >
              <img
                :src="userFollower.followChannel?.avatar || 'default-avatar.png'"
                alt="Avatar"
                class="w-full h-full rounded-full object-cover"
              />
            </div>

            <div class="flex flex-col truncate">
              <div class="flex flex-row items-center">
                <p class="text_para truncate w-36" :title="userFollower.followChannel?.channelName">
                  {{ userFollower.followChannel?.channelName }}
                </p>
                <verified
                  width="16px"
                  height="16px"
                  v-if="userFollower.followChannel.popularCheck"
                  class="mx-3 fill-blue flex-shrink-0"
                />
              </div>
              <div
                v-if="userFollower.isStreaming"
                class="flex text_secondary text-body text-[12px] gap-x-1"
              >
                <p>Just move</p>
                •
                <p>{{ userFollower.viewers }} viewers</p>
              </div>
              <!-- STREAMING FASLE NÈ-->
              <div v-else class="flex text_secondary text-body text-[12px] gap-x-2">
                <p class="">{{ userFollower.followChannel.followCount }} followers</p>
              </div>
            </div>
          </RouterLink>
        </div>
        <!-- HAVE FOLLOWING CATEGORIES -->
        <div
          v-if="userStore.followCategories.length && userStore.user"
          class="flex flex-col mt-2 gap-y-2"
        >
          <p class="mb-2 text-body font-semibold">Follow categories</p>
          <RouterLink
            v-if="userStore.followCategories.length"
            v-for="userFollowCategory in userStore.followCategories"
            :key="userFollowCategory.category?.id"
            class="flex items-center justify-start gap-x-2 cursor-pointer hover:bg-primary-light/20 rounded-md p-1"
            :to="`/browse/categories/${userFollowCategory.category?.title}`"
          >
            <div
              class="flex items-center justify-center size-[44px] rounded-full p-[2px] flex-shrink-0"
            >
              <img
                :src="userFollowCategory.category?.imgUrl || 'default-avatar.png'"
                alt="Avatar"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
            <div class="flex flex-col truncate">
              <div class="flex items-center gap-x-5">
                <p class="text_para truncate">
                  {{ userFollowCategory.category?.title }}
                </p>
              </div>
              <div class="flex gap-x-1 text_secondary text-body text-[12px]">
                <p>Total view:</p>
                <p>{{ userFollowCategory.category?.totalViews || 0 }}</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  <!-- HIDDEN -->
  <div
    v-else
    class="hidden md:block sticky top-[64px] h-[calc(100vh-64px)] w-[70px] border-2 border-gray-dark transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col h-full">
      <div
        class="flex items-center justify-center hover:bg-gray-light rounded-md my-1.5 py-4 px-3 cursor-pointer mx-2"
        v-tooltip="'Expand sidebar '"
        @click="handleShow"
      >
        <i class="pi pi-arrow-right text-[16px]" style="font-weight: 800"></i>
      </div>
      <!-- NOT LOG IN -->
      <div v-if="!userStore.user" class="flex justify-center mt-4 rounded-md mx-2">
        <div
          v-tooltip="'Sign up'"
          class="flex items-center w-full justify-center hover:bg-primary-light/20 rounded-md py-4 px-3 cursor-pointer"
          @click="openLoginPopup"
        >
          <i class="pi pi-sign-in"></i>
        </div>
      </div>
      <!-- NOTE FOLLOWING CHANNEL -->
      <RouterLink
        v-if="
          userStore.followers.length === 0 &&
          userStore.followCategories.length === 0 &&
          userStore.user
        "
        v-tooltip="'Browse'"
        class="flex justify-center items-center py-[12px] mt-4 rounded-md cursor-pointer hover:bg-primary/20 text-center mx-2"
        to="/browse/categories"
      >
        <Category />
      </RouterLink>
      <div
        class="flex flex-col gap-y-2 my-2 items-center 3 h-full overflow-y-auto overflow-x-hidden scrollbar-custom px-2 mr-0.5"
      >
        <div
          v-if="userStore.followers.length && userStore.user"
          class="my-2"
          v-tooltip="'Follow channel'"
        >
          <User />
        </div>
        <RouterLink
          v-if="userStore.followers.length && userStore.user"
          v-for="userFollower in userStore.followers"
          :key="userFollower.id"
          class="flex items-center justify-center gap-x-3 cursor-pointer hover:bg-primary-light/20 rounded-md p-1"
          v-tooltip="userFollower.followChannel.channelName"
          :to="`/user/${userFollower.followChannel.User.username}`"
        >
          <div
            :class="[
              'flex items-center justify-center size-[44px] rounded-full p-[2px] flex-shrink-0',
              userFollower.followChannel.isLive
                ? 'border-[3px] border-red'
                : 'border-[3px] border-transparent',
            ]"
          >
            <img
              :src="userFollower.followChannel?.avatar || 'default-avatar.png'"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
        </RouterLink>
        <div
          v-if="userStore.followCategories.length && userStore.user"
          class="my-2"
          v-tooltip="'Follow category'"
        >
          <i class="pi pi-th-large"></i>
        </div>
        <RouterLink
          v-if="userStore.followCategories.length && userStore.user"
          v-for="userFollowCategory in userStore.followCategories"
          :key="userFollowCategory.category?.id"
          class="flex items-center justify-center gap-x-3 cursor-pointer hover:bg-primary-light/20 rounded-md p-1"
          :to="`/browse/categories/${userFollowCategory.category?.title}`"
          v-tooltip="userFollowCategory.category?.title"
        >
          <div
            class="flex items-center justify-center size-[44px] rounded-full p-[2px] flex-shrink-0"
          >
            <img
              :src="userFollowCategory.category?.imgUrl || 'default-avatar.png'"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style></style>
