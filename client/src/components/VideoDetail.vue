<script>
  import Avatar from 'primevue/avatar';
  import MMAImage from '../assets/category/MMA.png';
  import Verified from './icons/verified.vue';
  import Live from './icons/live.vue';
  import share from './icons/share.vue';
  import heart from './icons/heart.vue';

  export default {
    components: {
      Avatar,
      Verified,
      Live,
      share,
      heart,
    },
    data() {
      return {
        videoDetails: {
          nameChannel: 'dianeTV',
          avatar: MMAImage,
          followers: 2222,
          status: 'Online',
          isLive: true,
        },
        isMenuVisible: false,
        isFilled: false,
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuVisible = !this.isMenuVisible;
      },
      closeMenu() {
        this.isMenuVisible = false;
      },
      toggleFill() {
        this.isFilled = !this.isFilled;
      },
    },
  };
</script>

<template>
  <div class="p-40">
    <div class="flex items-center space-x-4 mb-3 w-full">
      <div class="flex-grow flex items-center space-x-4">
        <div class="relative inline-block">
          <div
            :class="[
              'w-[56px] h-[56px] rounded-full flex items-center justify-center',
              videoDetails.isLive ? 'border-[3px] border-[#FF3131] p-0.5' : '',
            ]"
          >
            <Avatar
              :image="videoDetails.avatar"
              size="xlarge"
              shape="circle"
              class="w-full h-full rounded-full"
            />
            <Live
              v-if="videoDetails.isLive"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
            />
          </div>
        </div>
        <div>
          <p class="text-[20px] flex items-center">
            {{ videoDetails.nameChannel }}
            <Verified class="ml-2 mb-1 mr-2 fill-blue" />
            is now {{ videoDetails.status }}
          </p>
          <p class="text-[14px] text-body">{{ videoDetails.followers }} followers</p>
        </div>
      </div>
      <div
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
      <div class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase">
        <share class="mr-1" /> Share
      </div>
      <button class="btn">Gift REPs <i class="pi pi-angle-right text-white" /></button>
      <div class="relative">
        <button
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
  </div>
</template>

<style lang="scss"></style>
