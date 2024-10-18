<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { copyToClipboard } from '@/utils/copyToClipboard';
  import Filter from '@components/Filter.vue';
  import Camera from '@/components/icons/camera.vue';
  import Key from '@/components/icons/key.vue';
  import LiveStream from '@/components/icons/liveStream.vue';
  import { useCategoriesStore } from '@/stores';
  import { useLevelWorkoutStore } from '@/stores';
  import InLiveStream from './InLiveStream.vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import EndLiveStream from './EndLiveStream.vue';

  const categoriesStore = useCategoriesStore();
  const levelWorkoutStore = useLevelWorkoutStore();

  const props = defineProps({
    statusLive: String,
    connectOBS: Boolean,
  });

  const streamKey = ref('HE329132-32342MfS342-3rwer');
  const title = ref('');
  const description = ref('');
  const isCameraSelected = ref(false);
  const isLiveStreamSelected = ref(true);

  // COPYTOCLIPBOARD
  const handleCopyStreamKey = () => {
    copyToClipboard(
      streamKey.value,
      'Successfully copied to clipboard',
      'Failed copied to clipboard',
    );
  };

  // SELECT OPTION
  const categoryOptions = computed(() => categoriesStore.categoryOptions);
  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkoutOptions);

  const selectCategoryOptions = ref('');
  const selectLevelWorkoutOptions = ref('');

  // CATEGORIES VS LEVEL WORKOUT

  watch(categoryOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectCategoryOptions.value) {
      selectCategoryOptions.value = newOptions[0].value || '';
    }
  });

  watch(levelWorkoutOptions, (newOptions) => {
    if (newOptions.length > 0 && !selectLevelWorkoutOptions.value) {
      selectLevelWorkoutOptions.value = newOptions[0].value || '';
    }
  });

  onMounted(async () => {
    await categoriesStore.fetchCategories();
    await levelWorkoutStore.fetchLevelWorkout();
  });
</script>
<template>
  <section class="">
    <div class=" ">
      <!-- SCREEN LIVE -->
      <div v-if="statusLive === 'beforeLive'" class="px-8 flex items-center flex-col">
        <!-- STREAMING SOFTWARE -->
        <div v-if="isLiveStreamSelected" class="w-full flex justify-center">
          <div
            class="flex flex-col max-w-[1028px] basis-full justify-center rounded-lg shadow-md bg-white mb-6 overflow-hidden"
          >
            <!-- SCREEN DONT" CONNET OBS -->
            <div v-if="!props.connectOBS" class="flex w-full p-4">
              <div class="relative bg-black h-[560px] rounded-md w-full">
                <div class="flex justify-center items-center h-full flex-col gap-y-3">
                  <LiveStream />
                  <span class="text-white">Connect streaming software to go live</span>
                </div>
                <div class="absolute top-3 left-3 bg-red text-white px-3 py-1 rounded-md text-sm">
                  <span>Live</span>
                </div>
              </div>
            </div>
            <!-- SCREEN CONNECT OBCS -->
            <div v-if="props.connectOBS" class="flex w-full p-4">
              <LiveStreamScreen />
            </div>
            <!-- YOUR SCREEN -->
            <div class="pt-2 pb-6 px-8">
              <div class="flex w-full items-center justify-between gap-x-3">
                <p class="font-semibold">Your screen</p>
                <div
                  class="p-2 flex justify-center items-center rounded-full cursor-pointer hover:bg-gray-light"
                >
                  <i class="pi pi-arrow-down-left-and-arrow-up-right-to-center text-body"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- SETUP -->
        <div class="w-full flex justify-center gap-x-7">
          <!-- LEFT -->
          <div class="flex max-w-[500px] flex-col gap-y-3 basis-1/2">
            <!-- SELECT A VIDEO SOURCE -->
            <div class="bg-white rounded-lg shadow-md p-4 overflow-hidden">
              <h1 class="font-semibold">Select a video source</h1>
              <div class="flex justify-center gap-x-3 my-5">
                <!-- CAMERA -->
                <div class="w-1/2">
                  <div
                    class="flex justify-center border-2 border-gray-dark relative rounded-lg cursor-pointer hover:bg-gray-light/40"
                    :class="{ 'border-primary': isCameraSelected }"
                    @click="selectCamera"
                  >
                    <div class="px-3 py-6 md:py-10">
                      <div
                        class="p-2 flex justify-center items-center rounded-full bg-gray-dark"
                        :class="{ 'bg-primary': isCameraSelected }"
                      >
                        <Camera :fill="isCameraSelected ? '#fff' : '#000'" />
                      </div>
                    </div>
                  </div>
                  <h1 class="text-xs mt-2 text-center">Webcam</h1>
                </div>
                <!-- OBS -->
                <div class="w-1/2">
                  <div
                    class="flex justify-center border-2 border-gray-dark relative rounded-lg cursor-pointer hover:bg-gray-light/40"
                    :class="{ 'border-primary': isLiveStreamSelected }"
                    @click="selectStreaming"
                  >
                    <div class="px-3 py-6 md:py-10">
                      <div
                        class="p-2 flex justify-center items-center rounded-full bg-gray-dark"
                        :class="{ 'bg-primary': isLiveStreamSelected }"
                      >
                        <Key :fill="isLiveStreamSelected ? '#fff' : '#000'" />
                      </div>
                    </div>
                  </div>
                  <h1 class="text-xs mt-2 text-center">Streaming software</h1>
                </div>
              </div>
              <p class="text-xs text-body">
                Preview streams via streaming software are subject to
                <span class="text-primary font-medium">MOVE</span>'s Community Standards and
                policies. Live stream content may be retained for review and enforcement purposes.
              </p>
            </div>
            <!-- CAMERA SOFTWARE SETUP -->

            <!-- STREAMING SOFTWARE SETUP -->
            <div
              v-if="isLiveStreamSelected"
              class="bg-white rounded-lg shadow-md p-4 overflow-hidden"
            >
              <h1 class="font-semibold mb-2">Streaming software setup</h1>
              <p class="text-xs text-body">
                Copy and paste the stream key into your streaming software.
              </p>
              <div class="my-4">
                <h1 class="font-semibold mb-4">Stream key</h1>
                <div class="flex items-center gap-x-3 mb-2">
                  <input type="text" v-model="streamKey" class="input_custom bg-gray-light" />
                  <div
                    v-tooltip.top="'copy stream key'"
                    class="flex justify-center items-center text-white p-3 rounded-full bg-primary-light cursor-pointer hover:bg-primary"
                    @click="handleCopyStreamKey"
                  >
                    <i class="pi pi-link text-xl"></i>
                  </div>
                </div>
                <p class="text-xs text-body">
                  This stream key is valid until you log out of MOVE. Once you start to preview the
                  broadcast you have up to 4 hours to go live.
                </p>
              </div>
            </div>
          </div>
          <!-- RIGHT - DETAIL POST -->
          <div
            class="flex flex-col max-w-[500px] self-start basis-1/2 p-4 bg-white rounded-lg shadow-md w-fit"
          >
            <h1 class="font-semibold mb-4">Add post details</h1>
            <div class="flex flex-col gap-y-4">
              <input type="text" class="input_custom" v-model="title" placeholder="Title" />
              <textarea
                type="text"
                class="input_custom h-32 resize-none"
                v-model="description"
                placeholder="Description"
              ></textarea>
            </div>
            <div class="flex flex-col my-4 gap-y-3">
              <h1 class="font-semibold">Categories</h1>
              <Filter
                :class="'w-full py-1 border !border-gray-dark'"
                :options="categoryOptions"
                @change="selectCategoryOptions = $event.title"
              />
            </div>
            <div class="flex flex-col gap-y-3">
              <h1 class="font-semibold">Level workout</h1>
              <Filter
                :class="'w-full py-1 !border-gray-dark'"
                :options="levelWorkoutOptions"
                @change="selectLevelWorkoutOptions = $event.title"
              />
            </div>
          </div>
        </div>
        <!-- IN LIVE STREAM -->
      </div>
      <!-- INLIVESTREAM -->
      <InLiveStream v-if="statusLive === 'inLive'" />
      <!-- END LIVE STREAM -->
      <EndLiveStream v-if="statusLive === 'afterLive'" />
    </div>
  </section>
</template>
