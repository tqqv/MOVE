<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { formatRating, formatDuration, formatView } from '@/utils';
  import { toast } from 'vue3-toastify';
  import share from '@icons/share.vue';
  import axiosInstance from '@/services/axios';
  import { watch } from 'vue';
  import ReportDialog from './ReportDialog.vue';
  import Rate from '@components/Rate.vue';
  import rateIcon from '@icons/rate.vue';
  import { usePopupStore } from '@/stores';
  import ReportStream from './ReportStream.vue';

  const popupStore = usePopupStore();
  const props = defineProps({
    video: {
      type: Object,
      required: true,
    },
    reportType: {
      type: String,
      default: 'video',
    },
  });
  const emit = defineEmits(['updateRate']);
  const isMenuVisible = ref(false);
  const isFilled = ref(false);
  const isShareVisible = ref(false);
  const isReportVisible = ref(false);
  const isReportSuccessVisible = ref(false);
  const reportTypeVideos = ref([]);

  const selectedReportVideo = ref(null);

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
  const toggleRateVideo = () => {
    isMenuVisible.value = false;
  };
  const closeShare = () => {
    isShareVisible.value = false;
  };

  const showDialogReportVideo = () => {
    getAllReportTypes();
    isReportVisible.value = true;
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
      popupStore.openLoginPopup();
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
</script>

<template>
  <div class="flex items-center justify-between">
    <h3 class="text-[20px] whitespace-nowrap text-black">{{ video?.title }}</h3>
    <div class="flex items-center">
      <rateIcon class="mr-2 scale-125" />
      <span class="text-[20px] font-bold">{{ formatRating(video?.ratings) }}</span>
    </div>
  </div>
  <div class="flex items-center mb-2 text-[13px] mt-2">
    <span class="text-red">{{ formatView(video?.viewCount) }} view</span>
    <span class="font-bold text-sm px-2">•</span>
    <span class="text-primary">{{ video?.category.title }}</span>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex gap-2 items-center text-[11px] font-bold">
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">
        {{
          video?.levelWorkout?.levelWorkout || video?.livestreamLevelWorkout?.levelWorkout || 'N/A'
        }}
      </span>
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{ duration }}</span>
    </div>
    <div class="flex items-center gap-9">
      <Rate
        title="Rate Video"
        @rate="toggleRateVideo"
        :videoId="video?.id"
        @updateRate="updateRate"
      />
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
        </div>
      </div>
      <ReportStream v-if="reportType === 'stream'" :liveStreamId="video?.id" />
    </div>
  </div>
</template>
