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

  const popupStore = usePopupStore();
  const videoStore = useVideoStore();
  const { uploadProgress, isNext } = storeToRefs(videoStore);
  const { showVideoDetailPopup } = storeToRefs(popupStore);
  const { openVideoDetailPopup } = popupStore;
  const value = ref('1');
</script>
<template>
  <Button label="Video details" @click="openVideoDetailPopup" />
  <Dialog
    v-model:visible="showVideoDetailPopup"
    modal
    header="Video details"
    :draggable="false"
    :style="{ width: '842px' }"
  >
    <div class="grid grid-cols-10 gap-4">
      <div class="col-span-2">
        <div class="flex items-center gap-2 cursor-pointer" @click="value = '1'">
          <span
            class="size-[30px] rounded-full bg-black text-white font-bold flex justify-center items-center"
            >1</span
          >
          <h3 class="text-[16px] font-bold text-black">Details</h3>
        </div>
        <div class="flex items-center gap-2 mt-4 cursor-pointer" @click="value = '2'">
          <span
            class="size-[30px] rounded-full bg-footer text-white font-bold flex justify-center items-center"
            >2</span
          >
          <h3 class="text-[16px] font-bold text-footer">Tags</h3>
        </div>
        <div class="flex items-center gap-2 mt-4 cursor-pointer" @click="value = '3'">
          <span
            class="size-[30px] rounded-full bg-footer text-white font-bold flex justify-center items-center"
            >3</span
          >
          <h3 class="text-[16px] font-bold text-footer">Settings</h3>
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
      <div class="flex gap-x-10 items-center" v-if="value === '1' && uploadProgress === 100">
        <div class="flex justify-center items-center flex-col gap-y-3">
          <div class="custom-spinner w-10"></div>
          <h3 class="text-link">Processing ...</h3>
        </div>
        <h3 class="w-[350px] text-link">
          Feel free to add your video details, tags and settings in the meantime!
        </h3>
      </div>
      <!-- Gen completed -->
      <!-- <div class="flex justify-center items-center flex-col">
        <div class="size-9 rounded-full bg-primary flex justify-center items-center">
          <i class="pi pi-check text-white text-[20px]"></i>
        </div>
        <h3 class="text-link">Upload complete</h3>
      </div> -->
      <div class="flex gap-x-10">
        <button
          v-if="value !== '1'"
          class="text-link hover:text-primary-light font-bold text-[14px]"
        >
          Back
        </button>
        <button
          :class="[isNext && uploadProgress === 100 ? 'btn' : 'btnDisable', 'px-14']"
          v-if="value !== '3'"
        >
          Next
        </button>
        <button class="btnDisable px-14" v-if="value === '3'">Pushlish</button>
      </div>
    </div>
  </Dialog>
</template>
