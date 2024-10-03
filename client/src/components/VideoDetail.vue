<script setup>
  import { ref } from 'vue';
  // import MMAImage from '../assets/category/MMA.png';
  import Verified from './icons/verified.vue';
  import Live from './icons/live.vue';
  import share from './icons/share.vue';
  import heart from './icons/heart.vue';

  const props = defineProps({
    isButtonGiftREPsVisible: {
      type: Boolean,
      default: false,
    },
    isUserAction: {
      type: Boolean,
      default: false,
    },
    channelDetails: {
      type: Object,
      required: true,
    },
    totalFollower: {
      type: Number,
      required: true,
    },
  });

  const isMenuVisible = ref(false);
  const isFilled = ref(false);

  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
  };

  const closeMenu = () => {
    isMenuVisible.value = false;
  };

  const toggleFill = () => {
    isFilled.value = !isFilled.value;
  };
</script>

<template>
  <div class="flex items-center space-x-4 mb-3 w-full">
    <div class="flex-grow flex items-center space-x-4">
      <div class="relative inline-block">
        <div
          :class="[
            'flex items-center justify-center  w-16 h-16 rounded-full',
            channelDetails.isLive ? 'border-[3px] border-red' : '',
          ]"
        >
          <img
            :src="channelDetails.avatar"
            alt="Avatar"
            class="w-full h-full rounded-full object-cover p-[1.5px]"
          />
          <Live
            v-if="channelDetails.isLive"
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          />
        </div>
      </div>
      <div>
        <p class="text-[20px] flex items-center">
          <span class="mr-2"> {{ channelDetails.channelName }} </span>
          <Verified v-if="channelDetails.popularCheck" class="ml-1 mb-1 mr-2 fill-blue" />
          <span class="whitespace-nowrap" v-if="channelDetails.isLive"> is now online</span>
          <span class="whitespace-nowrap" v-else> is now offline</span>
        </p>

        <p class="text-[14px] text-body">{{ totalFollower }} followers</p>
      </div>
    </div>
    <div
      v-if="isUserAction"
      class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase"
      @click="toggleFill"
    >
      <heart
        :fill="isFilled ? 'fill-primary' : 'fill-white'"
        stroke="stroke-primary"
        class="mr-1"
      />
      Follow
    </div>
    <div
      v-if="isUserAction"
      class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase"
    >
      <share class="mr-1" /> Share
    </div>
    <button v-if="isButtonGiftREPsVisible" class="btn">
      Gift REPs <i class="pi pi-angle-right text-white" />
    </button>
    <div class="relative">
      <button
        v-if="isUserAction"
        aria-expanded="false"
        aria-controls="menu"
        class="pi pi-ellipsis-v text-primary text-[20px]"
        @click="toggleMenu"
      />
      <div
        v-if="isMenuVisible"
        class="absolute bottom-full mb-2 w-[115px] h-[40px] bg-white shadow rounded-md z-50"
      >
        <ul class="flex items-center justify-center h-full m-0 p-0">
          <li
            class="flex items-center justify-center text-[13px] cursor-pointer text-center"
            @click="closeMenu"
          >
            Report video
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
