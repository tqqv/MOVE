<script setup>
  import { ref } from 'vue';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Tabs from 'primevue/tabs';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import Divider from 'primevue/divider';
  import ProgressBar from 'primevue/progressbar';
  import Detail from './stepper/Detail.vue';
  import Setting from './stepper/Setting.vue';
  import Tag from './stepper/Tag.vue';
  import { usePopupStore, useVideoStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import axios from '@/services/axios';
  import { useConfirm } from 'primevue/useconfirm';
  import { toast } from 'vue3-toastify';
  import ConfirmDialog from 'primevue/confirmdialog';

  const popupStore = usePopupStore();
  const videoStore = useVideoStore();
  const {
    uploadProgress,
    isNext,
    uploadTitle,
    uploadDescription,
    uri,
    thumbnailPreview,
    commentSetting,
  } = storeToRefs(videoStore);
  const { showVideoDetailPopup } = storeToRefs(popupStore);
  const { openVideoDetailPopup, closeVideoDetailPopup } = popupStore;
  const value = ref('1');

  const confirm = useConfirm();
  const showConfirmDialog = ref(false);

  const confirmModal = () => {
    confirm.require({
      message:
        'Your video is not published yet, you will lose all details in your video. Are you sure to close this window?',
      header: 'You have not published your video',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Confirm',
        severity: 'danger',
      },
      accept: () => {
        closeVideoDetailPopup();
        showConfirmDialog.value = false;
      },
      reject: () => {
        openVideoDetailPopup();
        showConfirmDialog.value = false;
      },
    });
  };

  const handleNextClick = async () => {
    if (value.value === '1') {
      try {
        const response = await axios.post('video/upload-metadata', {
          videoUri: uri.value,
          title: uploadTitle.value,
          description: uploadDescription.value,
        });
        if (response.status === 200) {
          value.value = '2';
        }
      } catch (error) {
        toast.error('Error uploading metadata');
      }
    } else if (value.value === '2') {
      value.value = '3';
    }
  };

  const handlePublishClick = async () => {
    const videoId = uri.value.split('/').pop();
    try {
      const response = await axios.patch('video/update-video', {
        videoId,
        updateData: {
          isCommentable: commentSetting.value,
          status: 'public',
        },
      });
      if (response.status === 200) {
        toast.success('Video published successfully');
        closeVideoDetailPopup();
        showConfirmDialog.value = false;
      }
    } catch (error) {
      toast.error('Error updating video comment setting');
    }
  };
  const handleBackClick = () => {
    if (value.value === '2') {
      value.value = '1';
    } else if (value.value === '3') {
      value.value = '2';
    }
  };
  const handleClosePopup = () => {
    closeVideoDetailPopup();
    confirmModal();
  };
</script>
<template>
  <Button label="Video details" @click="openVideoDetailPopup" />
  <Dialog
    v-model:visible="showVideoDetailPopup"
    modal
    header="Video details"
    :draggable="false"
    :style="{ width: '842px' }"
    @hide="handleClosePopup"
  >
    <div class="grid grid-cols-10 gap-4">
      <div class="col-span-2">
        <div class="flex items-center gap-2">
          <span
            class="size-[30px] rounded-full text-white font-bold flex justify-center items-center"
            :class="{ 'bg-black': value === '1', 'bg-footer': value !== '1' }"
            >1</span
          >
          <h3
            class="text-[16px] font-bold"
            :class="{ 'text-black': value === '1', 'text-footer': value !== '1' }"
          >
            Details
          </h3>
        </div>
        <div class="flex items-center gap-2 mt-4">
          <span
            class="size-[30px] rounded-full text-white font-bold flex justify-center items-center"
            :class="{ 'bg-black': value === '2', 'bg-footer': value !== '2' }"
            >2</span
          >
          <h3
            class="text-[16px] font-bold text-footer"
            :class="{ 'text-black': value === '2', 'text-footer': value !== '2' }"
          >
            Tags
          </h3>
        </div>
        <div class="flex items-center gap-2 mt-4">
          <span
            class="size-[30px] rounded-full text-white font-bold flex justify-center items-center"
            :class="{ 'bg-black': value === '3', 'bg-footer': value !== '3' }"
            >3</span
          >
          <h3 class="text-[16px] font-bold text-footer" :class="{ 'text-black': value === '3' }">
            Settings
          </h3>
        </div>
      </div>
      <div class="col-span-8">
        <Tabs v-model:value="value">
          <TabPanels class="p-0">
            <TabPanel value="1"><Detail /></TabPanel>
            <TabPanel value="2">
              <Tag />
            </TabPanel>
            <TabPanel value="3">
              <Setting />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    <Divider />
    <div class="flex justify-between items-center mb-2">
      <!-- Loading when uploading video -->
      <div class="w-[200px]" v-if="value === '1' && uploadProgress !== 100">
        <ProgressBar :value="uploadProgress" class="hide-progress-value"></ProgressBar>
        <h3 class="mt-1 text-nowrap text-link text-[14px]">
          Uploading video ({{ uploadProgress }}%)
        </h3>
      </div>
      <!-- Loading when gen thumbnail -->
      <div
        class="flex gap-x-10 items-center"
        v-if="value === '1' && uploadProgress === 100 && !thumbnailPreview"
      >
        <div class="flex justify-center items-center flex-col gap-y-3">
          <div class="custom-spinner w-10"></div>
          <h3 class="text-link">Processing ...</h3>
        </div>
        <h3 class="w-[350px] text-link">
          Feel free to add your video details, tags and settings in the meantime!
        </h3>
      </div>
      <!-- Gen completed -->
      <div
        v-if="uploadProgress === 100 && thumbnailPreview"
        class="flex justify-center items-center flex-col"
      >
        <div class="size-9 rounded-full bg-primary flex justify-center items-center">
          <i class="pi pi-check text-white text-[20px]"></i>
        </div>
        <h3 class="text-link">Upload complete</h3>
      </div>
      <div class="flex gap-x-10">
        <button
          v-if="value !== '1'"
          class="text-link hover:text-primary-light font-bold text-[14px] leading-none"
          @click="handleBackClick"
        >
          Back
        </button>
        <button
          :class="[
            isNext && uploadProgress === 100 && thumbnailPreview ? 'btn' : 'btnDisable',
            'px-14 leading-none',
          ]"
          v-if="value !== '3'"
          @click="handleNextClick"
        >
          Next
        </button>
        <button class="btn px-14 leading-none" v-if="value === '3'" @click="handlePublishClick">
          Pushlish
        </button>
      </div>
    </div>
  </Dialog>
  <ConfirmDialog v-model:visible="showConfirmDialog" :style="{ width: '604px' }"></ConfirmDialog>
</template>
