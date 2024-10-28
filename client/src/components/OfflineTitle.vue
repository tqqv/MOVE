<script setup>
  import { computed, ref } from 'vue';
  import { formatRating, formatDuration, formatView } from '@/utils';
  import { toast } from 'vue3-toastify';
  import rate from '@icons/rate.vue';
  import heart from '@icons/heart.vue';
  import share from '@icons/share.vue';

  const props = defineProps({
    video: {
      type: Object,
      required: true,
    },
  });

  const isMenuVisible = ref(false);
  const isFilled = ref(false);
  const isShareVisible = ref(false);

  const duration = computed(() => {
    if (formatDuration(props.video?.duration) < 30) return '< 30 mins';
    if (formatDuration(props.video?.duration) < 60) return '< 1 hour';
    return '> 1 hour';
  });

  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
    isShareVisible.value = false;
  };

  const toggleShare = () => {
    isShareVisible.value = !isShareVisible.value;
    isMenuVisible.value = false;
  };

  const closeShare = () => {
    isShareVisible.value = false;
  };

  const closeMenu = () => {
    isMenuVisible.value = false;
  };

  const handleClickShareFacebook = async () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const fbShareUrl = `https://www.facebook.com/dialog/share?app_id=${
      import.meta.env.VITE_FACEBOOK_APP_ID
    }&href=${shareUrl}&display=popup`;

    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(fbShareUrl, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
  };

  const handleClickCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success('Copy link successfully');
      })
      .catch((err) => {
        toast.error(`Can't copy this link: `, err);
      });
  };
</script>

<template>
  <div class="flex items-center justify-between">
    <h3 class="text-[20px] whitespace-nowrap text-black">{{ video.title }}</h3>
    <div class="flex items-center">
      <rate class="mr-2 scale-125" />
      <span class="text-[20px] font-bold">{{ formatRating(video.ratings) }}</span>
    </div>
  </div>
  <div class="flex items-center mb-2 text-[13px] mt-2">
    <span class="text-red">{{ formatView(video.viewCount) }} view</span>
    <span class="font-bold text-sm px-2">•</span>
    <span class="text-primary">{{ video.category.title }}</span>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex gap-2 items-center text-[11px] font-bold">
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{
        video.levelWorkout.levelWorkout
      }}</span>
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{ duration }}</span>
    </div>
    <div class="flex items-center gap-9">
      <div class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase">
        <i class="pi pi-star mr-1"></i> Rate Video
      </div>
      <div class="relative">
        <button
          class="text-primary text-[13px] font-bold flex items-center uppercase"
          @click="toggleShare"
        >
          <share class="mr-1" /> Share
        </button>
        <div
          v-if="isShareVisible"
          class="absolute bottom-full w-[200px] h-auto bg-white shadow rounded-md z-50 right-0 p-4 mb-2"
        >
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-[16px]">Share via</h3>
            <button @click="closeShare"><i class="pi pi-times hover:text-primary"></i></button>
          </div>
          <ul class="flex justify-center gap-8">
            <li
              class="flex flex-col items-center text-[13px] cursor-pointer gap-2 group"
              @click="handleClickShareFacebook"
            >
              <i class="pi pi-facebook text-[#1771ed] text-[40px]"></i>
              <h4 class="group-hover:text-primary">Facebook</h4>
            </li>
            <li
              class="flex flex-col items-center text-[13px] cursor-pointer gap-2 group"
              @click="handleClickCopyLink"
            >
              <div
                class="w-[40px] h-[40px] rounded-full border-primary border-2 flex items-center justify-center"
              >
                <i class="pi pi-link text-primary text-[25px]"></i>
              </div>
              <h4 class="group-hover:text-primary">Copy link</h4>
            </li>
          </ul>
        </div>
      </div>
      <div class="relative">
        <button
          aria-expanded="false"
          aria-controls="menu"
          class="pi pi-ellipsis-v text-primary text-[20px]"
          @click="toggleMenu"
        />
        <div
          v-if="isMenuVisible"
          class="absolute bottom-full mb-2 w-[115px] h-[40px] bg-white shadow rounded-md z-[1000] right-0"
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
