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
          status: 'Offline',
          isLive: true,
        },
      };
    },
  };
</script>

<template>
  <div>
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

      <button class="btn">Gift REPs <i class="pi pi-angle-right text-white" /></button>
    </div>
  </div>
</template>

<style lang="scss"></style>
