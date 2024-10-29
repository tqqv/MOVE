<script setup>
  import { usePopupStore } from '@/stores';
  import { onMounted, onUnmounted, ref } from 'vue';
  import ReportChannelPopup from './reportUser/ReportChannelPopup.vue';

  const props = defineProps({
    channelName: String,
  });

  const popupStore = usePopupStore();

  const isMenuVisible = ref(false);
  const handleOpenReportChannelDialog = () => {
    popupStore.openReportChannel();
    isMenuVisible.value = false;
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
  <ReportChannelPopup :channelName="props.channelName" />
</template>
