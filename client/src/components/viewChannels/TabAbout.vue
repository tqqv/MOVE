<script setup>
  import { ref } from 'vue';
  import FacebookIcon from '@/components/icons/facebookIcon.vue';
  import YoutubeIcon from '@/components/icons/youtubeIcon.vue';
  import InstagramIcon from '@/components/icons/instagramIcon.vue';
  import MMAImage from '@/assets/category/MMA.png';
  import Verified from '@/components/icons/verified.vue';
  import Live from '@/components/icons/live.vue';

  const props = defineProps({
    videoDetails: {
      type: Object,
      required: true,
    },
  });
  const dataFollowing = ref([
    {
      id: 1,
      name: 'dianeTV',
      avatar: MMAImage,
      followers: 2222,
      isLive: true,
      isVerified: true,
    },
    {
      id: 2,
      name: 'jensen94',
      avatar: MMAImage,
      followers: 1111,
      isLive: true,
      isVerified: false,
    },
    {
      id: 3,
      name: 'prabhu777',
      avatar: MMAImage,
      followers: 333,
      isLive: false,
      isVerified: true,
    },
    {
      id: 4,
      name: 'missyjoe',
      avatar: MMAImage,
      followers: 1,
      isLive: false,
      isVerified: false,
    },
  ]);
</script>
<template>
  <div class="space-y-8">
    <div class="grid grid-cols-10 gap-6 pt-2">
      <div class="col-span-7 bg-black text-white p-3 rounded-lg space-y-2">
        <span class="font-bold text-[17px]">About {{ videoDetails.channelName }}</span>
        <p v-if="videoDetails.bio && videoDetails.bio.length > 0" class="text-sm break-words">
          {{ videoDetails.bio }}
        </p>
        <p v-else class="text-sm break-words italic">No information found.</p>
      </div>
      <div class="col-span-3 space-y-2">
        <span class="font-bold text-[17px] text-black">Social network</span>
        <div
          v-if="videoDetails.facebookUrl || videoDetails.youtubeUrl || videoDetails.instaUrl"
          class="flex gap-4"
        >
          <a
            v-if="videoDetails.facebookUrl"
            :href="videoDetails.facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon class="cursor-pointer" />
          </a>
          <a
            v-if="videoDetails.youtubeUrl"
            :href="videoDetails.youtubeUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeIcon class="cursor-pointer" />
          </a>
          <a
            v-if="videoDetails.instaUrl"
            :href="videoDetails.instaUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon class="cursor-pointer" />
          </a>
        </div>
        <div v-else class="text-sm italic">No social network found.</div>
      </div>
    </div>
    <div class="space-y-8">
      <div class="text-2xl font-bold text-black">{{ videoDetails.channelName }} is following</div>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(item, index) in dataFollowing"
          :key="index"
          class="flex flex-col items-center space-y-4"
        >
          <div class="relative inline-block">
            <div
              :class="[
                'flex items-center justify-center w-16 h-16 rounded-full',
                item.isLive ? 'border-[3px] border-red' : '',
              ]"
            >
              <img
                :src="item.avatar"
                alt="Avatar"
                class="w-full h-full rounded-full object-cover p-[1.5px]"
              />
              <Live
                v-if="item.isLive"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
              />
            </div>
          </div>
          <div class="flex flex-col items-center text-center">
            <p class="text-[20px] flex items-center justify-center">
              {{ item.name }}
              <Verified v-if="item.isVerified" class="ml-2 mb-1 mr-2 fill-blue" />
            </p>
            <p class="text-[14px] text-body">{{ item.followers }} followers</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
