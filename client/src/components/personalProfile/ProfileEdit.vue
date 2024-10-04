<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';
  import Button from 'primevue/button';
  import ChangePasswordPopup from '../changePassword/ChangePasswordPopup.vue';
  import { usePopupStore } from '@/stores/popup.store';
  import ChangePasswordSuccessPopup from '../changePassword/ChangePasswordSuccessPopup.vue';
  import { fetchCountries, fetchStates } from '@/services/address';
  import { useUserStore } from '@/stores/user.store';
  import { updateProfile } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { uploadAvatar } from '@/services/cloudinary';
  import { checkDataChanged, getChangedFields } from '@/functions/compareData';
  import { updateProfileSchema } from '@/functions/vadilation';
  import Warning from '../icons/warning.vue';

  const userStore = useUserStore();
  const profileData = ref({
    username: '',
    email: '',
    fullName: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    avatar: '',
    dob: '',
  });

  const initialProfileData = ref({ ...profileData.value });
  const countries = ref([]);
  const states = ref([]);
  const isLoadingAvatar = ref(false);
  const errors = ref({});

  // VALIDATION
  const validateProfileData = async () => {
    try {
      await updateProfileSchema.validate(profileData.value, { abortEarly: false }); // abortEarly choose all false not choose first false
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

  // DISABLED EMAIL
  const handleSetDisabledEmail = () => {};

  // UPDATE GENDER
  function updateSelection(value) {
    profileData.value.gender = value;
  }
  // OPEN POPUP
  const popupStore = usePopupStore();

  const openPasswordDialog = () => {
    popupStore.openChangePassword();
  };

  // CAPITALIZE
  const capitalizeInput = (event, field) => {
    const words = event.target.value.split(' ');
    event.target.value = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    profileData.value[field] = event.target.value;
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
    if (profileData.value.country) {
      loadStates(profileData.value.country.iso2);
      profileData.value.country = profileData.value.country.name;
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

  // CHECK THE CHANGE VALUES
  const isProfileChanged = computed(() =>
    checkDataChanged(profileData.value, initialProfileData.value),
  );

  // UPDATE PROFILE
  const handleUpdate = async () => {
    const isValid = await validateProfileData();
    if (!isValid) {
      toast.error('Please check the information again');
      return;
    }

    const changedFields = getChangedFields(profileData.value, initialProfileData.value);
    if (Object.keys(changedFields).length > 0) {
      try {
        const response = await updateProfile(changedFields);
        if (!response.error) {
          initialProfileData.value = { ...profileData.value };
          await userStore.fetchUserProfile();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('Failed to update profile');
      }
    }
  };

  onMounted(async () => {
    await userStore.fetchUserProfile();
    loadCountries();

    if (userStore.user) {
      updateProfileData(userStore.user);
    }
  });

  const updateProfileData = (user) => {
    profileData.value = {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      country: user.country,
      state: user.state,
      city: user.city,
      dob: user.dob,
    };
    initialProfileData.value = { ...profileData.value };
  };

  watch(
    () => userStore.user,
    (newUser) => {
      if (newUser) {
        updateProfileData(newUser);
      }
    },
    { immediate: true },
  );
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
            :src="profileData.avatar"
            :alt="profileData.username"
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
        class="text-primary cursor-pointer text-[14px] hover:font-medium w-fit"
        @click="handleFileInputClick"
      >
        Update profile picture
      </span>
    </div>
    <div class="flex flex-col w-full md:w-1/2 my-3">
      <div class="flex flex-col gap-y-4">
        <!-- USERNAME -->
        <div class="flex flex-col gap-y-2">
          <label for="username" class="text_para">Username</label>
          <div
            class="relative text-[14px] rounded-lg"
            :class="errors.username ? 'error_password' : 'normal_password'"
          >
            <input
              v-model="profileData.username"
              type="text"
              placeholder="Enter username"
              class="password_custom"
              required
            />
            <Warning
              v-if="errors.username"
              class="absolute top-1/2 right-2 transform -translate-y-1/2 pi pi-exclamation-triangle"
            />
          </div>
          <span v-if="errors.username" class="error_message">{{ errors.username }}</span>
        </div>
        <!-- EMAIL -->
        <div class="flex flex-col gap-y-2">
          <label for="email" class="text_para">Email</label>
          <div
            class="relative text-[14px] rounded-lg"
            :class="errors.email ? 'error_password' : 'normal_password'"
          >
            <input
              v-model="profileData.email"
              type="email"
              disabled
              class="password_custom bg-gray-light"
              :class="{ 'italic text-body ': !profileData.email }"
              required
            />
            <p
              v-show="!profileData.email"
              @click="handleSetDisabledEmail"
              class="absolute text-[13px] right-3 top-2 mt-1 text-primary cursor-pointer"
            >
              Setup email
            </p>
          </div>
        </div>
        <!-- FULLNAME -->
        <div class="flex flex-col gap-y-2">
          <label for="username" class="text_para">Username</label>
          <div
            class="relative text-[14px] rounded-lg"
            :class="errors.fullName ? 'error_password' : 'normal_password'"
          >
            <input
              v-model="profileData.fullName"
              type="text"
              placeholder="Enter full name"
              class="password_custom capitalize"
              required
              @input="(e) => capitalizeInput(e, 'fullName')"
            />
            <Warning
              v-if="errors.fullName"
              class="absolute top-1/2 right-2 transform -translate-y-1/2 pi pi-exclamation-triangle"
            />
          </div>
          <span v-if="errors.fullName" class="error_message">{{ errors.fullName }}</span>
        </div>

        <div class="flex flex-col gap-y-6">
          <!--FORGOT PASSWORD  -->
          <div class="flex flex-col gap-y-1">
            <label for="password" class="text_para">Password</label>
            <span
              class="text-primary cursor-pointer text-[14px] underline w-fit"
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
                :checked="profileData.gender === 'Male'"
                @update:modelValue="updateSelection('Male')"
              />
              <CheckboxCustom
                label="Female"
                groupName="gender"
                :checked="profileData.gender === 'Female'"
                @update:modelValue="updateSelection('Female')"
              />
            </div>
          </div>
          <!-- DATE OF BIRTH -->
          <div class="flex flex-col gap-y-2 w-full md:w-1/2">
            <label for="gender" class="text_para">Date of birth</label>
            <div
              class="relative text-[14px] rounded-lg"
              :class="errors.dob ? 'error_password' : 'normal_password'"
            >
              <input
                v-model="profileData.dob"
                class="password_custom w-full text-[14px]"
                type="date"
                name=""
              />
            </div>
            <span v-if="errors.dob" class="error_message">{{ errors.dob }}</span>
          </div>
          <!-- COUNTRY VS STATE -->
          <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
            <div class="flex flex-col gap-y-2 w-full md:w-1/2">
              <label for="gender" class="text_para">Country</label>
              <select
                v-model="profileData.country"
                class="select_custom"
                @change="handleCountryChange"
              >
                <option v-if="!profileData.country" disabled value="null">Select country</option>
                <option v-else selected>{{ profileData.country }}</option>
                <option v-for="country in countries" :key="country.code" :value="country">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-y-2 w-full md:w-1/2">
              <label for="district" class="text_para">State</label>
              <select v-model="profileData.state" class="select_custom">
                <option v-if="!profileData.state" disabled value="null">Select country</option>
                <option v-else selected>{{ profileData.state }}</option>
                <option v-for="state in states" :key="state.code" :value="state.name">
                  {{ state.name }}
                </option>
              </select>
            </div>
          </div>
          <!-- CITY -->
          <div class="flex flex-col w-full md:w-1/2 gap-y-2">
            <label for="city" class="text_para">City</label>
            <div
              class="relative text-[14px] rounded-lg"
              :class="errors.city ? 'error_password' : 'normal_password'"
            >
              <input
                v-model="profileData.city"
                type="text"
                placeholder="Enter city"
                class="password_custom capitalize"
                required
                @input="(e) => capitalizeInput(e, 'city')"
              />
              <Warning
                v-if="errors.city"
                class="absolute top-1/2 right-2 transform -translate-y-1/2 pi pi-exclamation-triangle"
              />
            </div>
            <span v-if="errors.city" class="error_message">{{ errors.city }}</span>
          </div>
        </div>
      </div>
      <Button
        :disabled="!isProfileChanged"
        type="submit"
        label="Save settings"
        class="btn w-full md:w-1/2 mt-8"
      />
    </div>
    <ChangePasswordPopup />
    <ChangePasswordSuccessPopup />
  </form>
</template>
