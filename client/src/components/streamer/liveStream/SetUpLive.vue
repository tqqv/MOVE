<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { copyToClipboard } from '@/utils/copyToClipboard';
  import Filter from '@components/Filter.vue';
  import Camera from '@/components/icons/camera.vue';
  import Key from '@/components/icons/key.vue';
  import { useCategoriesStore, useLiveStreamStore, usePopupStore, useUserStore } from '@/stores';
  import { useLevelWorkoutStore } from '@/stores';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import EmptyImage from '@/components/icons/emptyImage.vue';
  import NotConnectScreen from './NotConnectScreen.vue';
  import { toast } from 'vue3-toastify';
  import { changeStreamKey } from '@/services/streamer';
  import { uploadAvatar } from '@/services/cloudinary';
  import Chat from '@/components/icons/chat.vue';
  import Donate from '@/components/icons/donate.vue';
  import PopupInstructionLive from './PopupInstructionLive.vue';
  import PopupInstructionDonate from './PopupInstructionDonate.vue';
  import { getStreamKey, randomStreamKey } from '@/services/user';

  const props = defineProps({
    connectOBS: String,
    liveStatus: String,
  });

  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const categoriesStore = useCategoriesStore();
  const liveStreamStore = useLiveStreamStore();
  const levelWorkoutStore = useLevelWorkoutStore();

  const isLoadingAvatar = ref(false);
  const isCameraSelected = ref(false);
  const isLiveStreamSelected = ref(true);

  // DATA LIVESTREAM
  const streamKey = ref('');
  const streamId = computed(() => userStore.user?.Channel.id);
  const title = ref('');
  const description = ref('');
  const thumbnail = ref();
  const selectCategoryOptions = ref('');
  const selectLevelWorkoutOptions = ref('');
  const streamURL = import.meta.env.VITE_STREAM_URL_OBS;
  // HANDLE DATA LIVE
  const checkCompleteStatus = () => {
    const isComplete =
      title.value &&
      description.value &&
      thumbnail.value &&
      selectCategoryOptions.value != 0 &&
      selectLevelWorkoutOptions.value != 0;
    liveStreamStore.setCompleteStatus(isComplete ? true : false);
  };

  watch([title, description, thumbnail, selectCategoryOptions, selectLevelWorkoutOptions], () => {
    liveStreamStore.updateLiveStreamData({
      streamerId: streamId.value,
      streamKey: streamKey.value,
      title: title.value,
      description: description.value,
      thumbnailUrl: thumbnail.value,
      categoryId: selectCategoryOptions.value,
      levelWorkoutsId: selectLevelWorkoutOptions.value,
    });
    checkCompleteStatus();
  });
  // COPYTOCLIPBOARD
  const handleCopyStreamKey = () => {
    copyToClipboard(
      streamKey.value,
      'Successfully copied to clipboard',
      'Failed copied to clipboard',
    );
  };
  const handleCopyStreamURL = () => {
    copyToClipboard(streamURL, 'Successfully copied to clipboard', 'Failed copied to clipboard');
  };

  // UPLOAD IMAGE
  const fileInputRef = ref(null);

  const handleFileInputClick = () => {
    fileInputRef.value.click();
  };

  const handleSelectedFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    isLoadingAvatar.value = true;

    try {
      const data = await uploadAvatar(selectedFile);
      if (data.secure_url) {
        thumbnail.value = data.secure_url;
      } else {
        isLoadingAvatar.value = false;
        console.error(error);
      }
    } catch (error) {
      isLoadingAvatar.value = false;
      console.error(error);
    } finally {
      isLoadingAvatar.value = false;
    }
  };

  // HANDLE LIVE WEBCAM
  const handleLiveWebCam = () => {
    toast.info('We are developing this feature');
  };

  // SELECT OPTION
  const categoryOptions = computed(() => categoriesStore.categoriesForSelect);
  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkoutForSelect);

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

  // OPEN INSTRUCTION POPUP
  const openInstructionLiveChat = () => {
    popupStore.openInstructionLive();
  };

  const openInstructionDonate = () => {
    popupStore.openInstructionDonate();
  };

  const showStreamKey = ref(false);
  // CALL STREAM KEY
  const fetchStreamKey = async () => {
    try {
      const response = await getStreamKey();
      streamKey.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  onMounted(async () => {
    await categoriesStore.fetchCategories();
    await levelWorkoutStore.fetchLevelWorkout();
    await fetchStreamKey();

    // await fetchStreamerKey();
  });
</script>
<template>
  <section class="">
    <div class=" ">
      <!-- SCREEN LIVE -->
      <div
        v-if="
          props.connectOBS == null || props.liveStatus === 'streamReady' || props.liveStatus == null
        "
        class="px-8 flex items-center flex-col"
      >
        <!-- STREAMING SOFTWARE -->
        <div v-if="isLiveStreamSelected" class="w-full flex justify-center">
          <div
            class="flex flex-col max-w-[1028px] basis-full justify-center rounded-lg shadow-md bg-white mb-6 overflow-hidden"
          >
            <!-- SCREEN DONT" CONNET OBS -->
            <div
              v-if="
                (props.connectOBS == null || props.connectOBS == 'null') && props.liveStatus == null
              "
              class="flex w-full p-4"
            >
              <NotConnectScreen />
            </div>
            <!-- SCREEN CONNECT OBCS -->
            <div
              v-if="props.connectOBS === 'streamReady' || props.liveStatus === 'streamReady'"
              class="flex w-full p-4"
            >
              <LiveStreamScreen :isStreamer="true" :username="userStore.user.username" />
            </div>
            <!-- YOUR SCREEN -->
            <div class="pt-2 pb-6 px-8">
              <div class="flex w-full items-center justify-between gap-x-3">
                <p class="font-semibold">Your screen</p>
              </div>
            </div>
          </div>
        </div>
        <!-- SETUP -->
        <div class="w-full flex justify-center gap-x-7">
          <!-- LEFT -->
          <div class="flex max-w-[500px] flex-col gap-y-3 basis-1/2">
            <!-- STREAMING SOFTWARE SETUP -->
            <div
              v-if="isLiveStreamSelected"
              class="bg-white rounded-lg shadow-md p-4 overflow-hidden"
            >
              <h1 class="font-semibold mb-2">Streaming software setup</h1>
              <p class="text-xs text-body">
                Copy and paste stream url or stream key into your streaming software.
              </p>
              <div class="my-4">
                <h1 class="font-semibold mb-4">Server URL</h1>
                <div class="flex items-center gap-x-3 mb-2">
                  <div class="input_custom bg-gray-light truncate">
                    {{ streamURL }}
                  </div>

                  <div
                    v-tooltip.top="'copy stream url'"
                    class="flex justify-center items-center text-white p-3 rounded-full bg-primary-light cursor-pointer hover:bg-primary"
                    @click="handleCopyStreamURL"
                  >
                    <i class="pi pi-link text-xl"></i>
                  </div>
                </div>
                <h1 class="font-semibold mb-4 mt-5">Stream key</h1>
                <div class="flex items-center gap-x-3 mb-2">
                  <input
                    v-model="streamKey"
                    :type="showStreamKey ? 'text' : 'password'"
                    class="input_custom bg-gray-light truncate"
                    autocomplete="off"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    disabled
                  />
                  <div
                    v-tooltip.top="'copy stream key'"
                    class="flex justify-center items-center text-white p-3 rounded-full bg-primary-light cursor-pointer hover:bg-primary"
                    @click="handleCopyStreamKey"
                  >
                    <i class="pi pi-link text-xl"></i>
                  </div>
                </div>
                <div
                  @click="showStreamKey = !showStreamKey"
                  class="text_link cursor-pointer w-fit mb-2 ml-1"
                >
                  Show
                </div>
                <p class="text-xs text-body">
                  This stream key is valid until you log out of MOVE. Once you start to preview the
                  broadcast you have up to 4 hours to go live.
                </p>
              </div>
            </div>

            <!-- SET UP OTHER SCREEN -->

            <div class="bg-white rounded-lg shadow-md p-4 overflow-hidden">
              <h1 class="font-semibold mb-2">Set up another live stream screen</h1>
              <p class="text-xs text-body">
                Instructions for setting up a chat screen or a donate screen on the stream support
                section
              </p>
              <div class="flex gap-x-2 mt-4">
                <!-- SET UP CHAT -->
                <div class="w-1/2">
                  <div
                    class="flex justify-center border-2 border-gray-dark relative rounded-lg cursor-pointer hover:bg-gray-light/40"
                    @click="openInstructionLiveChat"
                  >
                    <div class="px-3 py-6 md:py-10">
                      <div
                        class="p-2 flex justify-center items-center rounded-full bg-gray-dark"
                        :class="{ 'bg-primary': isLiveStreamSelected }"
                      >
                        <Chat fill="#000" width="20px" height="20px" />
                      </div>
                    </div>
                  </div>
                  <h1 class="text-xs mt-2 text-center">Chat livestream</h1>
                </div>
                <!-- SET UP DONATE -->
                <div class="w-1/2">
                  <div
                    class="flex justify-center border-2 border-gray-dark relative rounded-lg cursor-pointer hover:bg-gray-light/40"
                    @click="openInstructionDonate"
                  >
                    <div class="px-3 py-6 md:py-10">
                      <div
                        class="p-2 flex justify-center items-center rounded-full bg-gray-dark"
                        :class="{ 'bg-primary': isLiveStreamSelected }"
                      >
                        <Donate />
                      </div>
                    </div>
                  </div>
                  <h1 class="text-xs mt-2 text-center">Donation</h1>
                </div>
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
                class="input_custom h-32 resize-none pr-1"
                v-model="description"
                placeholder="Description"
              ></textarea>
            </div>
            <div class="flex flex-col my-4 gap-y-3">
              <h1 class="font-semibold">Categories</h1>
              <Filter
                :class="'w-full py-1 border !border-gray-dark'"
                :options="categoryOptions"
                @change="selectCategoryOptions = $event.id"
              />
            </div>
            <div class="flex flex-col mb-6 gap-y-3">
              <h1 class="font-semibold">Level workout</h1>
              <Filter
                :class="'w-full py-1 !border-gray-dark'"
                :options="levelWorkoutOptions"
                @change="selectLevelWorkoutOptions = $event.id"
              />
            </div>
            <!-- UPLOAD THUMBNAIL -->
            <div class="flex flex-col gap-y-3">
              <div class="flex justify-between">
                <h1 class="font-semibold">Thumbnail</h1>
                <input
                  type="file"
                  id="myFile"
                  name="filename"
                  ref="fileInputRef"
                  class="hidden"
                  @change="handleSelectedFile"
                  accept="image/*"
                />

                <span
                  class="text-primary cursor-pointer text-[14px] w-fit"
                  @click="handleFileInputClick"
                >
                  Upload thumbnail
                </span>
              </div>
              <div class="relative min-h-[226px]">
                <div
                  v-show="isLoadingAvatar"
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div class="custom-spinner w-8"></div>
                </div>
                <!-- IMAGE THUMBNAIL -->
                <img
                  v-if="thumbnail"
                  :src="thumbnail"
                  class="w-full rounded-md object-cover"
                  :class="{ 'opacity-20': isLoadingAvatar }"
                />
                <!-- DONT THUMBNAIL -->
                <div
                  v-else
                  class="flex flex-col items-center justify-center rounded-md py-20 bg-gray-light/40 border-2 border-dashed border-gray-dark"
                  :class="{ 'opacity-20': isLoadingAvatar }"
                >
                  <EmptyImage />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PopupInstructionLive :streamId="streamId" />
    <PopupInstructionDonate :streamId="streamId" />
  </section>
</template>
