<script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import FacebookIcon from '@/components/icons/facebookIcon.vue';
  import YoutubeIcon from '@/components/icons/youtubeIcon.vue';
  import InstagramIcon from '@/components/icons/instagramIcon.vue';
  import Button from 'primevue/button';

    

  const streamKey = ref('12345678');
  const showStreamKey = ref(false);
  const avatar = ref('');
  const username = ref('');
  const bio = ref('');
  const facebookLink = ref('');
  const instagramLink = ref('');
  const youtubeLink = ref('');

  //   UPDATE AVATAR
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg9imqwrd/image/upload';
  const isLoadingAvatar = ref(false);
  const fileInputRef = ref(null);

  const handleFileInputClick = () => {
    fileInputRef.value.click();
  };

  const handleSelectedFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    isLoadingAvatar.value = true;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_KEY);
    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      const data = response.data;
      if (data.secure_url) {
        avatar.value = data.secure_url;
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
</script>
<template>
  <div class="py-4 mb-6 w-full md:w-1/2">
    <!-- STREAM KEY -->
    <div class="">
      <h1 class="text_subTitle text-[20px] mb-2">Stream key</h1>
      <p class="text_para">
        Your stream key connects your stream to MOVE. Never share your stream key with anyone or
        show it on stream!
      </p>
      <div class="flex justify-center mt-6 mb-2 gap-x-8">
        <input
          v-model="streamKey"
          :type="showStreamKey ? 'text' : 'password'"
          class="input_custom"
        />
        <div
          class="flex justify-center items-center text-white p-3 rounded-full bg-primary cursor-pointer"
        >
          <i class="pi pi-link text-2xl"></i>
        </div>
      </div>
      <button @click="showStreamKey = !showStreamKey" class="text_link">Show</button>
    </div>
    <hr class="h-px my-4 bg-gray-dark border-0" />
    <!-- UPDATE PROFILE  -->
    <form class="flex flex-col gap-y-3 pt-3">
      <!-- AVATAR -->
      <div class="flex flex-col gap-y-5">
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
              :src="avatar"
              :alt="username"
              class="size-20 rounded-full"
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
            <label for="username" class="text_subTitle">Username</label>
            <p class="text_subLabel">Name that wIll display on your channel & MOVE</p>
          </div>
          <input v-model="username" value="" type="text" class="input_custom" required />
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
            v-model="bio"
            type="text"
            class="input_custom h-32 resize-none"
            placeholder="Write something about yourself"
          ></textarea>
        </div>
        <!-- SOCIAL MEDIA -->
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-col gap-y-1">
            <label for="bio"
              ><span class="text_subTitle">Social links </span
              ><span class="italic">(optional)</span></label
            >
            <p class="text_subLabel">Add social links to display on your channel</p>
          </div>
          <div class="flex flex-col gap-y-4">
            <div class="flex items-center gap-x-3">
              <FacebookIcon class="cursor-pointer" />
              <input
                v-model="facebookLink"
                placeholder="www.facebook.com/facebook"
                type="text"
                class="input_custom"
              />
            </div>
            <div class="flex items-center gap-x-3">
              <InstagramIcon class="cursor-pointer" />
              <input
                v-model="instagramLink"
                placeholder="www.instagram.com/instagram"
                type="text"
                class="input_custom"
              />
            </div>
            <div class="flex items-center gap-x-3">
              <YoutubeIcon class="cursor-pointer" />
              <input
                v-model="youtubeLink"
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
        type="submit"
        label="Save settings"
        class="btn w-full md:w-1/2  mt-8 whitespace-nowrap"
      />
      
    </form>
  </div>
</template>
