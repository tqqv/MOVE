<script setup>
  import { usePopupStore } from '@/stores';
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import ReportChannelPopup from './reportUser/ReportChannelPopup.vue';
  import { getAllReportChannelTypes, reportChannel } from '@/services/report';
  import ReportDialog from './ReportDialog.vue';
  import { toast } from 'vue3-toastify';

  const props = defineProps({
    channelName: String,
    channelId: Number,
  });

  const popupStore = usePopupStore();
  const listReportChannel = ref([]);
  const isMenuVisible = ref(false);
  const selectReportChannel = ref(null);
  const handleOpenReportChannelDialog = async () => {
    try {
      await fetchListReportChannel();
      isMenuVisible.value = false;
    } catch (error) {
      console.log('Failed to fetch report channels:', error);
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
  const fetchListReportChannel = async () => {
    try {
      const response = await getAllReportChannelTypes();
      if (response.error) {
        popupStore.openLoginPopup();
      } else {
        listReportChannel.value = response.data;
        popupStore.openReportChannel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE SUBMIT REPORT CHANNEL
  const handleSubmitReportChannel = async () => {
    if (selectReportChannel.value.id) {
      try {
        const response = await reportChannel(props.channelId, selectReportChannel.value.id);
        toast.success('Report channel sent successfully');
        popupStore.closeReportChannel();
        popupStore.openReportSuccess();
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  };

  watch(
    selectReportChannel,
    (newVal) => {
      selectReportChannel.value = newVal;
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
      class="absolute mb-2 w-[145px] bg-white shadow rounded-md z-50 p-2 right-0 mt-2'"
    >
      <ul class="flex flex-col justify-center h-full gap-y-1 m-0 p-0">
        <li
          class="flex items-center gap-x-2 text-[12px] cursor-pointer text-start hover:bg-gray-dark px-3 py-1 rounded truncate"
          @click="handleOpenReportChannelDialog"
        >
          <i class="pi pi-flag text-sm"></i>
          <span class="truncate"> Report channel</span>
        </li>
      </ul>
    </div>
  </div>
  <ReportDialog
    title="channels"
    groupName="reportTypeChannel"
    :reportType="listReportChannel"
    :titleReport="`Report ${channelName}`"
    :selectedReport="selectReportChannel"
    :isReportVisible="popupStore.showReportChannel"
    :isReportSuccessVisible="popupStore.showReportSuccess"
    @update:selectedReport="selectReportChannel = $event"
    @hide="popupStore.closeReportChannel"
    @submit="handleSubmitReportChannel"
    @close="popupStore.closeReportSuccess"
    @hideSuccess="popupStore.closeReportSuccess"
  />
</template>
