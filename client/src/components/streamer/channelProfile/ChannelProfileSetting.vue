<script setup>
  import { computed, onMounted, ref } from 'vue';
  import FacebookIcon from '@/components/icons/facebookIcon.vue';
  import YoutubeIcon from '@/components/icons/youtubeIcon.vue';
  import InstagramIcon from '@/components/icons/instagramIcon.vue';
  import Button from 'primevue/button';
  import { useStreamerStore } from '@/stores/streamer.store';
  import { updateChannelProfile } from '@/services/streamer';
  import { toast } from 'vue3-toastify';
  import { checkDataChanged, getChangedFields } from '@/utils/compareData';
  import { uploadAvatar } from '@/services/cloudinary';
  import { updateChannelSchema } from '@/utils/vadilation';
  import Warning from '@/components/icons/warning.vue';
  import { copyToClipboard } from '@/utils/copyToClipboard';

  const streamerStore = useStreamerStore();
  const showStreamKey = ref(false);
  const profileData = ref({
    streamKey: '',
    avatar: '',
    username: '',
    channelName: '',
    bio: '',
    facebookUrl: '',
    instaUrl: '',
    youtubeUrl: '',
  });
  const initialProfileData = ref({ ...profileData.value });
  const errors = ref({});

  // VALIDATION
  const validateChannelData = async () => {
    try {
      await updateChannelSchema.validate(profileData.value, { abortEarly: false }); // abortEarly choose all false not choose first false
      errors.value = {};
      return true;
    } catch (validationErrors) {
      const validationResult = {};
      validationErrors.inner.forEach((error) => {
        validationResult[error.path] = error.message;
      });
      errors.value = validationResult;
      return false;
    }
  };

  // COPY STREAMKEY
  const handleCopyStreamKey = () => {
    copyToClipboard(
      profileData.value.streamKey,
      'Successfully copied to clipboard',
      'Failed copied to clipboard',
    );
  };
  //   UPDATE AVATAR
  const isLoadingAvatar = ref(false);
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
        profileData.value.avatar = data.secure_url;
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

  // CHECK THE CHANGE OF VALUE
  const isProfileChanged = computed(() =>
    checkDataChanged(profileData.value, initialProfileData.value),
  );

  //UPDATE PROFILE CHANNEL
  const handleUpdateProfileChannel = async () => {
    const isValid = await validateChannelData();
    if (!isValid) {
      toast.error('Please check the information again');
      return;
    }

    const changedFields = getChangedFields(profileData.value, initialProfileData.value);
    if (Object.keys(changedFields).length > 0) {
      try {
        const response = await updateChannelProfile(changedFields);
        if (!response.error) {
          initialProfileData.value = { ...profileData.value };
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        await streamerStore.fetchProfileChannel();
      }
    }
  };

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    if (streamerStore.streamerChannel) {
      profileData.value = {
        avatar: streamerStore.streamerChannel.avatar,
        username: streamerStore.streamerChannel.User.username,
        streamKey: streamerStore.streamerChannel.streamKey,
        channelName: streamerStore.streamerChannel.channelName,
        bio: streamerStore.streamerChannel.bio,
        facebookUrl: streamerStore.streamerChannel.facebookUrl,
        instaUrl: streamerStore.streamerChannel.instaUrl,
        youtubeUrl: streamerStore.streamerChannel.youtubeUrl,
      };
      initialProfileData.value = { ...profileData.value };
    }
  });
</script>
<template>
  <form
    @submit.prevent="handleUpdateProfileChannel"
    autocomplete="off"
    class="py-4 mb-6 w-full md:w-2/3 lg:w-1/2"
  >
    <!-- STREAM KEY -->
    <div class="">
      <h1 class="text_subTitle text-[20px] mb-2">Stream key</h1>
      <p class="text_subLabel">
        Your stream key connects your stream to MOVE. Never share your stream key with anyone or
        show it on stream!
      </p>
      <div class="flex justify-center mt-6 mb-2 gap-x-8">
        <input
          v-model="profileData.streamKey"
          :type="showStreamKey ? 'text' : 'password'"
          class="input_custom"
          autocomplete="false"
        />
        <div
          v-tooltip.top="'copy stream key'"
          class="flex justify-center items-center text-white p-3 rounded-full bg-primary-light cursor-pointer hover:bg-primary"
          @click="handleCopyStreamKey"
        >
          <i class="pi pi-link text-2xl"></i>
        </div>
      </div>
      <div @click="showStreamKey = !showStreamKey" class="text_link cursor-pointer w-fit">Show</div>
    </div>
    <hr class="h-px my-4 bg-gray-dark border-0" />
    <!-- UPDATE PROFILE  -->
    <div class="flex flex-col gap-y-3 pt-3">
      <!-- AVATAR -->
      <div class="flex flex-col gap-y-5 w-fit">
        <h1 class="font-bold">Profile picture</h1>
        <div class="flex">
          <div class="relative">
            <div
              v-show="isLoadingAvatar"
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div class="custom-spinner w-8"></div>
            </div>
            <img
              :src="profileData.avatar"
              :alt="profileData.channelName"
              class="size-20 rounded-full object-cover"
              :class="{ 'opacity-20': isLoadingAvatar }"
            />
          </div>
        </div>
        <input
          type="file"
          id="myFile"
          name="filename"
          ref="fileInputRef"
          class="hidden"
          @change="handleSelectedFile"
        />

        <span
          class="text-primary cursor-pointer text-[14px] hover:font-medium"
          @click="handleFileInputClick"
        >
          Update profile picture
        </span>
      </div>
      <!-- CONTENT -->
      <div class="flex flex-col gap-y-5 mt-5">
        <!-- USERNAME -->
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-col gap-y-1">
            <label for="" class="text_subTitle">Username</label>
            <p class="text_subLabel">Name that will display on your username & MOVE</p>
          </div>
          <div
            class="relative text-[14px] rounded-lg"
            :class="errors.username ? 'error_password' : 'normal_password'"
          >
            <input
              v-model="profileData.username"
              type="text"
              class="password_custom"
              autocomplete="false"
              required
            />
            <Warning
              v-if="errors.username"
              class="absolute top-1/2 right-2 transform -translate-y-1/2 pi pi-exclamation-triangle"
            />
          </div>
          <span v-if="errors.username" class="error_message">{{ errors.username }}</span>
        </div>
        <!-- CHANNEL NAME -->
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-col gap-y-1">
            <label for="channelName" class="text_subTitle">Channel name</label>
            <p class="text_subLabel">Name that will display on your channel & MOVE</p>
          </div>
          <div
            class="relative text-[14px] rounded-lg"
            :class="errors.channelName ? 'error_password' : 'normal_password'"
          >
            <input v-model="profileData.channelName" type="text" class="password_custom" required />
            <Warning
              v-if="errors.channelName"
              class="absolute top-1/2 right-2 transform -translate-y-1/2 pi pi-exclamation-triangle"
            />
          </div>
          <span v-if="errors.channelName" class="error_message">{{ errors.channelName }}</span>
        </div>
        <!-- BIO -->
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-col gap-y-1">
            <label for="bio"
              ><span class="text_subTitle">Bio </span><span class="italic">(optional)</span></label
            >
            <p class="text_subLabel">Tell us a little bit about yourself</p>
          </div>
          <textarea
            v-model="profileData.bio"
            type="text"
            class="input_custom h-32 resize-none"
            placeholder="Write something about yourself"
          ></textarea>
        </div>
        <!-- SOCIAL MEDIA -->
        <div class="flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-1">
            <label for="bio"
              ><span class="text_subTitle">Social links </span
              ><span class="italic">(optional)</span></label
            >
            <p class="text_subLabel">Add social links to display on your channel</p>
          </div>
          <div class="flex flex-col gap-y-6">
            <div class="flex items-center gap-x-3">
              <FacebookIcon class="cursor-pointer" />
              <input
                v-model="profileData.facebookUrl"
                placeholder="www.facebook.com/facebook"
                type="text"
                class="input_custom"
              />
            </div>
            <div class="flex items-center gap-x-3">
              <InstagramIcon class="cursor-pointer" />
              <input
                v-model="profileData.instaUrl"
                placeholder="www.instagram.com/instagram"
                type="text"
                class="input_custom"
              />
            </div>
            <div class="flex items-center gap-x-3">
              <YoutubeIcon class="cursor-pointer" />
              <input
                v-model="profileData.youtubeUrl"
                placeholder="www.youtube.com/youtube"
                type="text"
                class="input_custom"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- BUTTON -->
      <Button
        :disabled="!isProfileChanged"
        type="submit"
        label="Save settings"
        class="btn w-full lg:w-1/3 mt-8 whitespace-nowrap"
        :class="{ 'bg-footer': !isProfileChanged }"
      />
    </div>
  </form>
</template>
