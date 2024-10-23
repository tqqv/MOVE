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
    tab,
    keywords,
    selectCategoryOptions,
    selectLevelWorkoutOptions,
  } = storeToRefs(videoStore);
  const { showVideoDetailPopup, showConfirmDialog } = storeToRefs(popupStore);
  const { openVideoDetailPopup, closeVideoDetailPopup, openConfirmDialog, closeConfirmDialog } =
    popupStore;
  const { clear, setTab } = videoStore;

  const confirm = useConfirm();
  const publish = ref(false);

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
        closeConfirmDialog();
        clear();
      },
      reject: () => {
        openVideoDetailPopup();
        closeConfirmDialog();
      },
    });
  };

  const handleNextClick = async () => {
    const videoId = uri.value.split('/').pop();
    if (tab.value === '1') {
      try {
        const response = await axios.post('video/upload-metadata', {
          videoUri: uri.value,
          title: uploadTitle.value,
          description: uploadDescription.value,
        });
        if (response.status === 200) {
          setTab('2');
        }
      } catch (error) {
        toast.error('Error uploading metadata');
      }
    } else if (tab.value === '2') {
      try {
        const response = await axios.patch('video/update-video', {
          videoId,
          updateData: {
            categoryId: selectCategoryOptions.value,
            levelWorkoutsId: selectLevelWorkoutOptions.value,
            keywords: keywords.value,
          },
        });
        console.log(response);
        if (response.status === 200) {
          setTab('3');
        }
      } catch (error) {
        toast.error('Error updating video data');
      }
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
        publish.value = true;
        toast.success('Video published successfully');
        closeVideoDetailPopup();
        closeConfirmDialog();
        clear();
      }
    } catch (error) {
      toast.error('Error updating video comment setting');
    }
  };
  const handleBackClick = () => {
    if (tab.value === '2') {
      setTab('1');
    } else if (tab.value === '3') {
      setTab('2');
    }
  };
  const handleClosePopup = () => {
    closeVideoDetailPopup();
    if (!publish.value) {
      openConfirmDialog();
    }
    confirmModal();
  };
</script>
<template>
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
            :class="{ 'bg-black': tab === '1', 'bg-footer': tab !== '1' }"
            >1</span
          >
          <h3
            class="text-[16px] font-bold"
            :class="{ 'text-black': tab === '1', 'text-footer': tab !== '1' }"
          >
            Details
          </h3>
        </div>
        <div class="flex items-center gap-2 mt-4">
          <span
            class="size-[30px] rounded-full text-white font-bold flex justify-center items-center"
            :class="{ 'bg-black': tab === '2', 'bg-footer': tab !== '2' }"
            >2</span
          >
          <h3
            class="text-[16px] font-bold text-footer"
            :class="{ 'text-black': tab === '2', 'text-footer': tab !== '2' }"
          >
            Tags
          </h3>
        </div>
        <div class="flex items-center gap-2 mt-4">
          <span
            class="size-[30px] rounded-full text-white font-bold flex justify-center items-center"
            :class="{ 'bg-black': tab === '3', 'bg-footer': tab !== '3' }"
            >3</span
          >
          <h3 class="text-[16px] font-bold text-footer" :class="{ 'text-black': tab === '3' }">
            Settings
          </h3>
        </div>
      </div>
      <div class="col-span-8">
        <Tabs v-model:value="tab">
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
      <div class="w-[200px]" v-if="tab === '1' && uploadProgress !== 100">
        <ProgressBar :value="uploadProgress" class="hide-progress-value"></ProgressBar>
        <h3 class="mt-1 text-nowrap text-link text-[14px]">
          Uploading video ({{ uploadProgress }}%)
        </h3>
      </div>
      <!-- Loading when gen thumbnail -->
      <div
        class="flex gap-x-10 items-center"
        v-if="tab === '1' && uploadProgress === 100 && !thumbnailPreview"
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
          v-if="tab !== '1'"
          class="text-link hover:text-primary-light font-bold text-[14px] leading-none"
          @click="handleBackClick"
        >
          Back
        </button>
        <button
          :class="[
            isNext && uploadProgress === 100 && thumbnailPreview
              ? 'btn'
              : 'btnDisable cursor-not-allowed',
            'px-14 leading-none',
          ]"
          :disabled="!(isNext && uploadProgress === 100 && thumbnailPreview)"
          v-if="tab !== '3'"
          @click="handleNextClick"
        >
          Next
        </button>
        <button class="btn px-14 leading-none" v-if="tab === '3'" @click="handlePublishClick">
          Pushlish
        </button>
      </div>
    </div>
  </Dialog>
  <ConfirmDialog v-model:visible="showConfirmDialog" :style="{ width: '604px' }"></ConfirmDialog>
</template>
