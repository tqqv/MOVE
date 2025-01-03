<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { formatRating, formatDuration, formatView, genreDuration, formatDate } from '@/utils';
  import { toast } from 'vue3-toastify';
  import share from '@icons/share.vue';
  import axiosInstance from '@/services/axios';
  import { watch } from 'vue';
  import ReportDialog from './ReportDialog.vue';
  import Rate from '@components/Rate.vue';
  import rateIcon from '@icons/rate.vue';
  import { usePopupStore, useUserStore } from '@/stores';
  import ReportStream from './ReportStream.vue';

  const popupStore = usePopupStore();
  const userStore = useUserStore();
  const { user } = userStore;
  const props = defineProps({
    livestream: {
      type: Object,
      required: false,
    },
    video: {
      type: Object,
      required: false,
    },
    titleRate: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      default: 'video',
    },
    metricsData: Object,
  });
  const emit = defineEmits(['updateRate']);
  const isMenuVisible = ref(false);
  const isFilled = ref(false);
  const isShareVisible = ref(false);
  const isReportVisible = ref(false);
  const isReportSuccessVisible = ref(false);
  const reportTypeVideos = ref([]);

  const selectedReportVideo = ref(null);

  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
    isShareVisible.value = false;
  };

  const toggleShare = () => {
    isShareVisible.value = !isShareVisible.value;
    isMenuVisible.value = false;
  };
  const toggleRate = () => {
    isMenuVisible.value = false;
  };
  const closeShare = () => {
    isShareVisible.value = false;
  };

  const showDialogReportVideo = () => {
    if (user) {
      getAllReportTypes();
      isReportVisible.value = true;
    } else {
      popupStore.openLoginPopup();
    }
  };

  const closeReport = () => {
    isReportVisible.value = false;
  };

  const closeSuccess = () => {
    isReportSuccessVisible.value = false;
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.menu-container')) {
      isMenuVisible.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const handleSubmitReportVideo = async () => {
    if (selectedReportVideo.value.id) {
      try {
        const response = await axiosInstance.post('report/video', {
          videoId: props.video.id,
          reportTypeId: selectedReportVideo.value.id,
        });
        if (response.status === 200) {
          isReportVisible.value = false;
          isReportSuccessVisible.value = true;
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const closeReportSuccess = () => {
    isReportSuccessVisible.value = false;
    isMenuVisible.value = false;
  };

  const getAllReportTypes = async () => {
    try {
      const response = await axiosInstance.get('report/getListReport?type=videos');
      if (response.status === 200) {
        reportTypeVideos.value = response.data.data;
        isReportVisible.value = true;
      }
    } catch (error) {
      isReportVisible.value = false;
    }
  };

  watch(
    selectedReportVideo,
    (newVal) => {
      selectedReportVideo.value = newVal;
    },
    { deep: true },
  );

  const updateRate = () => {
    emit('updateRate');
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
  // show more handle
  const showFullText = ref(false);
  const maxLength = 250;
  const truncatedText = computed(() => {
    const text = props.video?.description || props?.livestream?.description;
    if (showFullText.value || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  });

  const toggleText = () => {
    showFullText.value = !showFullText.value;
  };
</script>

<template>
  <div class="flex items-center justify-between">
    <h3 class="text-[20px] whitespace-nowrap text-black font-semibold">
      {{ video?.title || livestream?.title }}
    </h3>
    <div class="flex items-center">
      <rateIcon class="mr-2 scale-125" />
      <span class="text-[20px] font-bold">{{
        formatRating(video?.ratings ?? props.metricsData?.avgRates)
      }}</span>
    </div>
  </div>
  <div class="flex items-center text-[13px] mt-2 mb-3">
    <span class="text-red">
      {{ formatView(video?.viewCount ?? props.metricsData?.currentViews) }} view
    </span>
    <span class="font-bold text-sm px-2 text-body">•</span>
    <span class="text-primary">{{ formatDate(video?.createdAt || livestream?.createdAt) }}</span>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex gap-2 items-center text-[11px] font-bold">
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{
        video?.category?.title || livestream?.category?.title
      }}</span
      ><span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">
        {{ video?.levelWorkout?.levelWorkout || livestream?.livestreamLevelWorkout?.levelWorkout }}
      </span>
    </div>
    <div class="flex items-center gap-9">
      <Rate
        titleRatePopup="Rate the stream"
        :title="titleRate"
        @rate="toggleRate"
        :videoId="video?.id"
        :livestreamId="livestream?.id"
        @updateRate="updateRate"
      />
      <div class="relative">
        <button
          class="text-primary text-[13px] font-bold flex items-center uppercase"
          @click="toggleShare"
        >
          <share class="mr-1" /> <span class=" hidden md:block">Share</span>
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
      <div v-if="reportType === 'video'" class="relative menu-container">
        <button
          aria-expanded="false"
          aria-controls="menu"
          class="pi pi-ellipsis-v text-primary text-[20px]"
          @click="toggleMenu"
        />
        <div
          v-if="isMenuVisible"
          class="absolute bottom-full mb-2 w-[125px] h-[40px] bg-white shadow rounded-md z-[1000] right-0"
        >
          <ul class="flex items-center justify-center h-full m-0 p-0">
            <li
              class="flex items-center gap-x-2 text-[12px] cursor-pointer text-start hover:bg-gray-dark px-3 py-1 rounded truncate"
              @click="showDialogReportVideo"
            >
              <i class="pi pi-flag text-sm"></i>
              <span class="truncate"> Report video</span>
            </li>
          </ul>
        </div>
      </div>
      <ReportDialog
        title="video"
        groupName="reportTypeVideos"
        titleReport="Report Video"
        :isReportVisible="isReportVisible"
        :isReportSuccessVisible="isReportSuccessVisible"
        :reportType="reportTypeVideos"
        :selectedReport="selectedReportVideo"
        @update:selectedReport="selectedReportVideo = $event"
        @close="closeReportSuccess"
        @submit="handleSubmitReportVideo"
        @hide="closeReport"
        @hideSuccess="closeSuccess"
      />
      <ReportStream v-if="reportType === 'stream'" :liveStreamId="video?.id" />
    </div>
  </div>
  <div class="p-2 bg-gray-light mt-4 rounded-md">
    <div class="flex flex-col gap-y-2 text-xs text-body">
      <div v-if="video?.duration" class="flex gap-x-3 font-semibold">
        <span>Type duration: </span>
        <span>{{ genreDuration(video?.duration) }} </span>
      </div>
      <div class="flex gap-x-3 flex-col items-start">
        <p class="text-xs">
          {{ truncatedText }}
        </p>
        <button
          v-if="
            (props?.video?.description && props.video.description.length > maxLength) ||
            (props?.livestream?.description && props.livestream.description.length > maxLength)
          "
          class="text-xs font-semibold cursor-pointer mt-1"
          @click="toggleText"
        >
          {{ showFullText ? 'Show Less' : 'Show More' }}
        </button>
      </div>
    </div>
  </div>
</template>
