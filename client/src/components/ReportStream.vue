<script setup>
  import { usePopupStore } from '@/stores';
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { getAllReportLiveStream, reportLiveStream } from '@/services/report';
  import ReportDialog from './ReportDialog.vue';
  import { toast } from 'vue3-toastify';

  const props = defineProps({
    liveStreamId: Number,
  });

  const popupStore = usePopupStore();
  const listReportLivestream = ref([]);
  const isMenuVisible = ref(false);
  const selectReportLiveStream = ref(null);

  const handleOpenReportLiveStreamDialog = async () => {
    try {
      await fetchListReportLiveStream();
      isMenuVisible.value = false;
    } catch (error) {
      console.log('Failed to fetch report live stream:', error);
    }
  };

  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
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

  // GET ALL REPORT
  const fetchListReportLiveStream = async () => {
    try {
      const response = await getAllReportLiveStream();
      if (response.error) {
        popupStore.openLoginPopup();
      } else {
        listReportLivestream.value = response.data;
        popupStore.openReportChannel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE SUBMIT REPORT LIVESTREAM
  const handleSubmitReportLiveStream = async () => {
    if (selectReportLiveStream.value.id) {
      try {
        const response = await reportLiveStream(
          props.liveStreamId,
          selectReportLiveStream.value.id,
        );
        toast.success('Report live stream sent successfully');
        popupStore.closeReportChannel();
        popupStore.openReportSuccess();
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  };

  watch(
    selectReportLiveStream,
    (newVal) => {
      selectReportLiveStream.value = newVal;
    },
    { deep: true },
  );
</script>

<template>
  <div class="relative menu-container">
    <button
      aria-expanded="false"
      aria-controls="menu"
      class="pi pi-ellipsis-v text-primary text-[20px]"
      @click="toggleMenu"
    />
    <div
      v-if="isMenuVisible"
      class="absolute mb-2 w-[155px] bg-white shadow rounded-md z-50 p-2 right-0 mt-2'"
    >
      <ul class="flex flex-col justify-center h-full gap-y-1 m-0 p-0">
        <li
          class="flex items-center gap-x-2 text-[12px] cursor-pointer text-start hover:bg-gray-dark px-3 py-1 rounded truncate"
          @click="handleOpenReportLiveStreamDialog"
        >
          <i class="pi pi-flag text-sm"></i>
          <span class="truncate"> Report livestream</span>
        </li>
      </ul>
    </div>
  </div>
  <ReportDialog
    title="livestream"
    groupName="reportTypeLiveStream"
    :reportType="listReportLivestream"
    :titleReport="`Report live stream`"
    :selectedReport="selectReportLiveStream"
    :isReportVisible="popupStore.showReportChannel"
    :isReportSuccessVisible="popupStore.showReportSuccess"
    @update:selectedReport="selectReportLiveStream = $event"
    @hide="popupStore.closeReportChannel"
    @submit="handleSubmitReportLiveStream"
    @close="popupStore.closeReportSuccess"
    @hideSuccess="popupStore.closeReportSuccess"
  />
</template>
