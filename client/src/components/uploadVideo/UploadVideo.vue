<script setup>
  import { ref } from 'vue';
  import { usePrimeVue } from 'primevue/config';
  import FileUpload from 'primevue/fileupload';
  import Button from 'primevue/button';
  import ProgressBar from 'primevue/progressbar';
  import Badge from 'primevue/badge';
  import Dialog from 'primevue/dialog';
  import videoUpload from '@/components/icons/videoUpload.vue';

  const $primevue = usePrimeVue();

  const totalSize = ref(0);
  const totalSizePercent = ref(0);
  const files = ref([]);

  const onSelectedFiles = (event) => {
    files.value = event.files;
    files.value.forEach((file) => {
      totalSize.value += parseInt(formatSize(file.size));
    });
  };

  const onTemplatedUpload = () => {
    console.log({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  };

  const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  };

  const visible = ref(false);
  const chooseCallback = ref(null);
  const uploadCallback = ref(null);
  const clearCallback = ref(null);

  const setCallbacks = ({
    chooseCallback: choose,
    uploadCallback: upload,
    clearCallback: clear,
  }) => {
    chooseCallback.value = choose;
    uploadCallback.value = upload;
    clearCallback.value = clear;
  };
</script>
<template>
  <Button label="Upload video" @click="visible = true" />
  <Dialog
    v-model:visible="visible"
    modal
    header="Upload a video"
    :draggable="false"
    :style="{ width: '842px', height: '476px' }"
  >
    <FileUpload
      name="demo[]"
      url="/api/upload"
      @upload="onTemplatedUpload($event)"
      :multiple="false"
      accept="video/*"
      :maxFileSize="2000000"
      @select="onSelectedFiles"
    >
      <template v-slot:header="slotProps">
        <div v-if="slotProps.chooseCallback">
          <div v-once>
            {{ setCallbacks(slotProps) }}
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex items-center justify-center flex-col py-14">
          <videoUpload @click="chooseCallback()" class="cursor-pointer fill-primary" />
          <p class="mt-6 mb-0">Drag and drop your video to upload.</p>
          <span class="capitalize mt-1">or</span>
          <div class="mt-1">
            <Button @click="chooseCallback()" class="btn hover:bg-primary-light"
              >Select a video</Button
            >
          </div>
          <span class="text-footer mt-1">Max file size: 2GB</span>
        </div>
      </template>
    </FileUpload>
  </Dialog>
</template>
