<script setup>
  import { ref, onMounted } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';
  import Button from 'primevue/button';
  import ChangePasswordPopup from '../changePassword/ChangePasswordPopup.vue';
  import { usePopupStore } from '@/stores/popup.store';
  import ChangePasswordSuccessPopup from '../changePassword/ChangePasswordSuccessPopup.vue';
  import { fetchCountries, fetchStates } from '@/services/address';
  import { useUserStore } from '@/stores/user.store';
  import { updateProfile } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import ProgressSpinner from 'primevue/progressspinner';
  import axios from 'axios';

  const userStore = useUserStore();

  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg9imqwrd/image/upload';

  const username = ref('');
  const email = ref('');
  const fullName = ref('');
  const gender = ref('');
  const country = ref('');
  const state = ref('');
  const city = ref('');
  const avatar = ref('');
  const dob = ref('');

  const countries = ref([]);
  const states = ref([]);

  const isLoadingAvatar = ref(false);

  // VALIDATE AGE
  const isAgeValid = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const userAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      userAge--;
    }
    return userAge >= 12;
  };

  // DISABLED EMAIL
  const handleSetDisabledEmail = () => {};

  // UPDATE GENDER
  function updateSelection(value) {
    gender.value = value;
    console.log(gender.value);
  }
  // OPEN POPUP
  const popupStore = usePopupStore();

  const openPasswordDialog = () => {
    popupStore.openChangePassword();
  };

  // CALL API COUNTRY
  const loadCountries = async () => {
    try {
      countries.value = await fetchCountries();
    } catch (error) {
      console.error(error);
    }
  };

  // CALL API STATES
  const loadStates = async (ios2) => {
    try {
      states.value = await fetchStates(ios2);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCountryChange = () => {
    if (country.value.iso2) {
      loadStates(country.value.iso2);
    }
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
  // UPDATE PROFILE

  const handleUpdate = async () => {
    if (!isAgeValid(dob.value)) {
      toast.error('Use must enough 12 years old ');
      return;
    }
    const updatedData = {
      username: username.value,
      email: email.value,
      fullName: fullName.value,
      gender: gender.value,
      country: country.value.name,
      state: state.value.name,
      city: city.value,
      avatar: avatar.value,
      dob: dob.value,
    };
    try {
      const response = await updateProfile(updatedData);
      await userStore.fetchUserProfile();
      toast.success(response.message);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  onMounted(async () => {
    await userStore.fetchUserProfile();
    if (userStore.user) {
      username.value = userStore.user.username;
      avatar.value = userStore.user.avatar;
      email.value = userStore.user.email || 'No found email';
      fullName.value = userStore.user.fullName;
      gender.value = userStore.user.gender;
      country.value = userStore.user.country || 'Select country';
      state.value = userStore.user.state || 'Select state';
      city.value = userStore.user.city;
      dob.value = userStore.user.dob || new Date().toISOString().split('T')[0];
    }
    loadCountries();
  });
</script>
<template>
  <form @submit.prevent="handleUpdate" class="my-2">
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
    <div class="flex flex-col w-full md:w-1/2 my-3">
      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-1">
          <label for="username" class="text_para">Username</label>
          <input v-model="username" value="" type="text" class="input_custom" required />
        </div>
        <div class="flex flex-col gap-y-1">
          <label for="email" class="text_para">Email</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              disabled
              class="input_custom"
              :class="{ 'italic text-body ': !email }"
              required
            />
            <p
              v-show="!email"
              @click="handleSetDisabledEmail"
              class="absolute text-[13px] right-3 top-2 mt-1 text-primary cursor-pointer"
            >
              Setup email
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-y-1">
          <label for="fullName" class="text_para">Full name</label>
          <input v-model="fullName" value="" type="text" class="input_custom" required />
        </div>
        <div class="flex flex-col gap-y-6">
          <!--FORGOT PASSWORD  -->
          <div class="flex flex-col gap-y-1">
            <label for="password" class="text_para">Password</label>
            <span
              class="text-primary cursor-pointer text-[14px] underline"
              @click="openPasswordDialog"
              >Change password</span
            >
          </div>
          <!-- GENDER -->
          <div class="flex flex-col gap-y-2">
            <label for="gender" class="text_para">Gender</label>
            <div class="flex gap-x-10">
              <CheckboxCustom
                label="Male"
                groupName="gender"
                :checked="gender === 'Male'"
                @update:modelValue="updateSelection('Male')"
              />
              <CheckboxCustom
                label="Female"
                groupName="gender"
                :checked="gender === 'Female'"
                @update:modelValue="updateSelection('Female')"
              />
            </div>
          </div>
          <!-- DATE OF BIRTH -->
          <div class="flex flex-col gap-y-2 w-full md:w-1/2">
            <label for="gender" class="text_para">Date of birth</label>
            <div class="flex">
              <input v-model="dob" class="w-full select_custom text-[14px]" type="date" name="" />
            </div>
          </div>
          <!-- COUNTRY VS STATE -->
          <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
            <div class="flex flex-col gap-y-2 w-full md:w-1/2">
              <label for="gender" class="text_para">City</label>
              <select v-model="country" class="select_custom" @change="handleCountryChange">
                <option selected>{{ country }}</option>
                <option v-for="country in countries" :key="country.code" :value="country">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-y-2 w-full md:w-1/2">
              <label for="district" class="text_para">State</label>
              <select v-model="state" class="select_custom">
                <option selected>{{ state }}</option>
                <option v-for="state in states" :key="state.code" :value="state">
                  {{ state.name }}
                </option>
              </select>
            </div>
          </div>
          <!-- CITY -->
          <div class="flex flex-col w-full md:w-1/2 gap-y-2">
            <label for="gender" class="text_para">City</label>
            <input v-model="city" value="" type="text" class="input_custom" />
          </div>
        </div>
      </div>
      <Button type="submit" label="Save settings" class="btn w-full md:w-1/2 mt-8" />
    </div>
    <ChangePasswordPopup />
    <ChangePasswordSuccessPopup />
  </form>
</template>
