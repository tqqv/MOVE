<script setup>
  import { onMounted, watch } from 'vue';
  import FacebookIcon from '@/components/icons/facebookIcon.vue';
  import YoutubeIcon from '@/components/icons/youtubeIcon.vue';
  import InstagramIcon from '@/components/icons/instagramIcon.vue';
  import Verified from '@/components/icons/verified.vue';
  import Live from '@/components/icons/live.vue';

  const props = defineProps({
    channelDetails: {
      type: Object,
      required: true,
    },
    followChannelDetails: {
      type: Object,
    },
    usernameDetails: {
      type: String,
    },
  });
  // const emit = defineEmits(['handleResetActiveTab']);
  // console.log('fl', props.followChannelDetails);

  // watch(
  //   () => props.followChannelDetails,
  //   () => {
  //     emit('handleResetActiveTab', '0');
  //   },
  // );
</script>
<template>
  <div class="space-y-8">
    <div class="grid grid-cols-10 gap-6 pt-2">
      <div class="col-span-7 bg-black text-white p-3 rounded-lg space-y-2">
        <span class="font-bold text-[17px]">About {{ channelDetails.channelName }}</span>
        <p v-if="channelDetails.bio && channelDetails.bio.length > 0" class="text-sm break-words">
          {{ channelDetails.bio }}
        </p>
        <p v-else class="text-sm break-words italic">No information found.</p>
      </div>
      <div class="col-span-3 space-y-2">
        <span class="font-bold text-[17px] text-black">Social network</span>
        <div
          v-if="channelDetails.facebookUrl || channelDetails.youtubeUrl || channelDetails.instaUrl"
          class="flex gap-4"
        >
          <a
            v-if="channelDetails.facebookUrl"
            :href="channelDetails.facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon class="cursor-pointer" />
          </a>
          <a
            v-if="channelDetails.youtubeUrl"
            :href="channelDetails.youtubeUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeIcon class="cursor-pointer" />
          </a>
          <a
            v-if="channelDetails.instaUrl"
            :href="channelDetails.instaUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon class="cursor-pointer" />
          </a>
        </div>
        <div v-else class="text-sm italic">No social network found.</div>
      </div>
    </div>
    <div v-if="followChannelDetails && followChannelDetails.length" class="space-y-8">
      <div class="text-2xl font-bold text-black">{{ channelDetails.channelName }} is following</div>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(item, index) in followChannelDetails"
          :key="index"
          class="flex flex-col items-center space-y-4"
        >
          <RouterLink :to="`/user/${item.User.username}`">
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
              </div></div
          ></RouterLink>
          <div class="flex flex-col items-center text-center">
            <p class="text-[20px] flex items-center justify-center">
              {{ item.channelName }}
              <Verified v-if="item.popularCheck" class="ml-2 mb-1 mr-2 fill-blue" />
            </p>
            <p class="text-[14px] text-body">{{ item.followCount ?? 0 }} followers</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
