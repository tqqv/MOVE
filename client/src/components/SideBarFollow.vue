<script setup>
  import { ref } from 'vue';
  import verified from '@icons/verified.vue';
  const userFollowers = [
    {
      id: 1,
      avatar:
        'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-1/449833626_122215725842002441_4511415059026978796_n.jpg?stp=cp6_dst-jpg_s160x160&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=AWcYzbvwetsQ7kNvgGIM5Qa&_nc_ht=scontent.fdad1-4.fna&_nc_gid=AHTvQKUNgNJc-Bosh9Y8rgW&oh=00_AYD5NlUqr1jJ_L46lmaGJn_EiECuZXWj5hLM_ku6YqPgfw&oe=66D48B72',
      username: 'npmh310',
      viewers: 30,
      verified: true,
      isStreaming: true,
      totalVideos: 10,
    },
    {
      id: 2,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      username: 'jane_doe',
      viewers: 15,
      verified: false,
      isStreaming: false,
      totalVideos: 8,
    },
    {
      id: 3,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      username: 'john_smith',
      viewers: 430,
      verified: false,
      isStreaming: true,
      totalVideos: 20,
    },
  ];
  // xử lý khi streaming la true sẽ luôn lên trên
  const sortedUserFollowers = userFollowers.sort((a, b) => b.isStreaming - a.isStreaming);

  // xu ly show va hidden sidebar
  const isShow = ref(true);

  const handleShow = () => {
    isShow.value = !isShow.value;
  };

  //  TRUYENP PROPS
  // const props = defineProps({
  //   userFollowers: {
  //     type: Array,
  //     required: true,
  //   },
  // });
</script>

<template>
  <!-- SHOW -->
  <div
    v-if="isShow"
    class="hidden md:block w-[251px] border-2 border-gray-dark transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-col px-4 py-4">
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
          v-for="userFollower in sortedUserFollowers"
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
              :src="userFollower.avatar"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex flex-row gap-x-3">
              <p class="text_para">{{ userFollower.username }}</p>
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
          v-for="userFollower in sortedUserFollowers"
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
              :src="userFollower.avatar"
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
