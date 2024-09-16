<script setup>
  import { ref } from 'vue';
  import { usePrimeVue } from 'primevue/config';
  import FileUpload from 'primevue/fileupload';
  import VideoUpload from '@icons/videoUpload.vue';
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
  <div>
    <label for="title" class="text-[16px] font-medium">Video title</label>
    <input
      id="title"
      name="title"
      type="text"
      placeholder="Add a title"
      class="input_custom mt-2"
    />
  </div>
  <div>
    <h3 class="text-[16px] font-medium mt-3">Video thumbnail</h3>
    <div class="mt-2 grid grid-flow-col auto-cols-[220px] overflow-x-auto gap-4 scrollbar-hide">
      <FileUpload
        name="demo[]"
        url="/api/upload"
        @upload="onTemplatedUpload($event)"
        :multiple="false"
        accept="image/*"
        :maxFileSize="10000000"
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
          <div class="flex items-center justify-center flex-col py-5 text-center">
            <VideoUpload @click="chooseCallback()" class="cursor-pointer fill-primary" />
            <p class="mt-6 mb-0 text-[12px]">Upload thumbnail</p>
          </div>
        </template>
      </FileUpload>
      <div class="h-full bg-red">1</div>
      <div class="h-full bg-primary">2</div>
      <div class="h-full bg-blue">3</div>
      <div class="h-full bg-gray-dark">4</div>
    </div>
  </div>
</template>
