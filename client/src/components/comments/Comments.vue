<script setup>
  import { ref } from 'vue';

  import MMAImage from '@/assets/category/MMA.png';
  import Rep from '../icons/rep.vue';
  import Verified from '@/components/icons/verified.vue';
  import Gift from '../icons/gift.vue';
  import Like from '../icons/like.vue';
  import Dislike from '../icons/dislike.vue';
  const isLike = ref(false);
  const isDisLike = ref(false);

  const toggleLike = () => {
    isLike.value = !isLike.value;
    if (isLike.value) isDisLike.value = false;
  };

  const toggleDislike = () => {
    isDisLike.value = !isDisLike.value;
    if (isDisLike.value) isLike.value = false;
  };
  const data = {
    avatar: MMAImage,
    username: 'thehoang17',
    viewers: 30,
    isVerified: true,
    isStreaming: true,
    totalVideos: 10,
    time: '20 mins ago',
    REPs: 2000,
    like: 200,
    dislike: 1000,
    message:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.',
  };
</script>
<template>
  <div class="space-y-6">
    <!-- View Comments -->
    <div class="flex gap-2">
      <!-- Avatar  -->
      <div class="flex flex-col items-center gap-2">
        <img
          :src="data.avatar"
          alt="Avatar"
          class="w-[40px] h-[40px] rounded-full object-cover border-[1.5px] border-white flex-shrink-0"
        />
      </div>

      <!-- Comment content  -->
      <div class="space-y-2 w-2/3 pt-1">
        <button
          class="bg-[#FFB564] w-[105px] p-1 rounded-full flex items-center justify-center text-[10px]"
        >
          <Rep class="mr-1" />
          <span class="text-white font-bold">REPs Sender</span>
        </button>
        <div class="flex gap-6">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold">{{ data.username }}</span>
            <Verified v-if="data.isVerified" class="ml-2 mb-1 mr-2 fill-blue" />
            <div class="flex items-center">
              <Gift class="mr-1" />
              <span class="text-xs mt-1 text-[#FFB564]">Gifted {{ data.REPs }} REPs</span>
            </div>
          </div>
          <span class="text-xs mt-1 text-[#666666]">{{ data.time }}</span>
        </div>
        <div class="break-words">
          <span class="text-sm text-black">{{ data.message }}</span>
        </div>
        <div class="flex gap-4 items-center">
          <div class="flex gap-2" @click="toggleLike">
            <Like
              class="cursor-pointer"
              :fill="isLike ? '#13CEB3' : 'white'"
              :stroke="isLike ? 'none' : '#13D0B4'"
            />
            <span>{{ data.like }}</span>
          </div>
          <div class="flex gap-2" @click="toggleDislike">
            <Dislike
              class="cursor-pointer mt-1"
              :fill="isDisLike ? '#13CEB3' : 'white'"
              :stroke="isDisLike ? 'none' : '#13D0B4'"
            /><span>{{ data.dislike }}</span>
          </div>
          <span class="text-[13px] text-primary cursor-pointer">Reply</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  input::placeholder {
    color: #666666;
    font-size: 14px;
    font-weight: 500;
  }
</style>
