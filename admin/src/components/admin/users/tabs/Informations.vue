<script setup>
  import { ref, onMounted, computed } from 'vue';
  import CheckboxCustom from '@/components/CheckboxCustom.vue';
  import Button from 'primevue/button';
  import { fetchCountries, fetchStates, fetchNational } from '@/services/address';
  import { getUserProfile } from '@/services/user';
  import { updateUserProfile } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { uploadAvatar } from '@/services/cloudinary';
  import { checkDataChanged, getChangedFields } from '@/utils/compareData';
  import { updateProfileSchema } from '@/utils/vadilation';
  import Warning from '@/components/icons/warning.vue';
  import DatePicker from 'primevue/datepicker';
  import Skeleton from 'primevue/skeleton';
  import SmallLoading from '@/components/icons/smallLoading.vue';

  const props = defineProps({
    userId: {
      type: String,
      required: true,
    },
  });

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
    nationality: '',
  });
  const userLoading = ref(true);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile(props.userId);
      profileData.value = {
        username: response.data.data.username,
        avatar: response.data.data.avatar,
        email: response.data.data.email,
        fullName: response.data.data.fullName,
        gender: response.data.data.gender,
        country: response.data.data.country,
        state: response.data.data.state,
        city: response.data.data.city,
        dob: response.data.data.dob,
      };
      initialProfileData.value = { ...profileData.value };
    } catch (error) {
      toast.error(error.message);
    } finally {
      userLoading.value = false;
    }
  };

  const initialProfileData = ref({ ...profileData.value });
  const countries = ref([]);
  const states = ref([]);
  const nationality = ref(null);

  const isLoadingAvatar = ref(false);
  const errors = ref({});
  const isLoading = ref(false);
  // VALIDATION
  const validateProfileData = async () => {
    try {
      await updateProfileSchema.validate(profileData.value, { abortEarly: false });
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

  // UPDATE GENDER
  function updateSelection(value) {
    profileData.value.gender = value;
  }

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
  const loadNational = async () => {
    try {
      nationality.value = await fetchNational(profileData.value.country);
      if (nationality.value && nationality.value[0]) {
        profileData.value.nationality = nationality.value[0].demonyms.eng.f;
      }
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
    await loadNational();

    const changedFields = getChangedFields(profileData.value, initialProfileData.value);
    if (Object.keys(changedFields).length > 0) {
      try {
        isLoading.value = true;

        const response = await updateUserProfile(props.userId, changedFields);
        if (!response.error) {
          initialProfileData.value = { ...profileData.value };
          await fetchUserProfile();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        isLoading.value = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  onMounted(async () => {
    await fetchUserProfile();
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
          <Skeleton v-if="userLoading" shape="circle" size="5rem"></Skeleton>
          <img
            v-else
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
        accept="image/*"
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
          <Skeleton v-if="userLoading" height="3rem"></Skeleton>
          <div
            v-else
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
          <Skeleton v-if="userLoading" height="3rem"></Skeleton>
          <div
            v-else
            class="relative text-[14px] rounded-lg"
            :class="errors.email ? 'error_password' : 'normal_password'"
          >
            <input
              v-model="profileData.email"
              type="email"
              :disabled="emailVerified"
              class="password_custom"
              :class="[!emailVerified ? ' ' : 'italic text-body bg-gray-light']"
              required
            />
          </div>
        </div>
        <!-- FULLNAME -->
        <div class="flex flex-col gap-y-2">
          <label for="username" class="text_para">Full name</label>
          <Skeleton v-if="userLoading" height="3rem"></Skeleton>
          <div
            v-else
            class="relative text-[14px] rounded-lg"
            :class="errors.fullName ? 'error_password' : 'normal_password'"
          >
            <input
              v-model="profileData.fullName"
              type="text"
              placeholder="Enter full name"
              class="password_custom capitalize"
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
          <!-- GENDER -->
          <div class="flex flex-col gap-y-2">
            <label for="gender" class="text_para">Gender</label>
            <div v-if="userLoading" class="flex items-center gap-x-3">
              <Skeleton shape="circle" size="2rem"></Skeleton>
              <Skeleton height="1.8rem" width="5rem"></Skeleton>
            </div>
            <div v-else class="flex gap-x-10">
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
            <Skeleton v-if="userLoading" height="3rem"></Skeleton>
            <DatePicker
              v-else
              v-model="profileData.dob"
              dateFormat="yy-mm-dd"
              :class="{ 'error-border': errors.dob }"
              :model-value="new Date(profileData.dob)"
            />
            <span v-if="errors.dob" class="error_message">{{ errors.dob }}</span>
          </div>
          <!-- COUNTRY VS STATE -->
          <Skeleton v-if="userLoading" height="3rem"></Skeleton>
          <div v-else class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
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
              <label for="district" class="text_para">State/ City</label>
              <select v-model="profileData.state" class="select_custom">
                <option v-if="!profileData.state" disabled value="null">Select state/ city</option>
                <option v-else selected>{{ profileData.state }}</option>
                <option v-for="state in states" :key="state.code" :value="state.name">
                  {{ state.name }}
                </option>
              </select>
            </div>
          </div>
          <!-- CITY -->
          <div class="flex flex-col w-full md:w-1/2 gap-y-2">
            <label for="city" class="text_para">District </label>
            <Skeleton v-if="userLoading" height="3rem"></Skeleton>
            <div
              v-else
              class="relative text-[14px] rounded-lg"
              :class="errors.city ? 'error_password' : 'normal_password'"
            >
              <input
                v-model="profileData.city"
                type="text"
                placeholder="Enter District"
                class="password_custom capitalize"
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
      <Button :disabled="!isProfileChanged" type="submit" class="btn w-full md:w-1/4 mt-8">
        <template #default>
          <SmallLoading v-if="isLoading" fill="white" fill_second="#13d0b4" />
          <span v-else>Save settings</span>
        </template></Button
      >
    </div>
  </form>
</template>

<style scoped>
  :deep(.p-inputtext) {
    border: 1.6px solid #dee3e9 !important;
    height: 45px;
  }
  :deep(.p-inputtext:focus) {
    border-color: #13d0b4 !important;
  }
  .error-border :deep(.p-inputtext) {
    background-color: #ffe0e4;
    border: 1.7px solid red !important;
    color: red;
  }
</style>
