<script setup>
  import { ref, onMounted } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';
  import Button from 'primevue/button';
  import ChangePasswordPopup from '../changePassword/ChangePasswordPopup.vue';
  import { usePopupStore } from '@/stores/popup.store';
  import ChangePasswordSuccessPopup from '../changePassword/ChangePasswordSuccessPopup.vue';
  import { fetchCountries, fetchStates } from '@/services/address';
  import { useUserStore } from '@/stores/user.store';

  const userStore = useUserStore();

  const username = ref('');
  const email = ref('');
  const fullName = ref('');
  const gender = ref('');
  const country = ref('');
  const state = ref('');
  const city = ref('');
  const avatar = ref('')


  const selectedDate = ref(new Date().toISOString().slice(0, 10));
  const selectedGender = ref(gender);

  const countries = ref([]);
  const selectedCountry = ref(country);
  const states = ref([]);
  const selectedState = ref(state);

  // DISABLED EMAIL
  const handleSetDisabledEmail = () => {};
  // UPDATE GENDER
  function updateSelection(value) {
    selectedGender.value = value;
  }
  // OPEN POPUP
  const popupStore = usePopupStore();

  const openPasswordDialog = () => {
    popupStore.openChangePassword();
  };

  // const showDialog = ref(false);
  // const openPasswordDialog = () => {
  //   showDialog.value = true;
  // };

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
    if (selectedCountry.value.iso2) {
      loadStates(selectedCountry.value.iso2);
    }
  };

  onMounted(async () => {
    await userStore.fetchUserProfile();

    if (userStore.user) {
      username.value = userStore.user.username || '';
      avatar.value = userStore.user.avatar
      email.value = userStore.user.email || 'No found email';
      fullName.value = userStore.user.fullName || '';
      gender.value = userStore.user.gender || 'Male';
      country.value = userStore.user.country;
      state.value = userStore.user.state;
      city.value = userStore.user.city;
    }
    loadCountries();
  });
</script>
<template>
  <form @submit.prevent="" class="my-2">
    <div class="flex flex-col gap-y-5">
      <h1 class="font-bold">Profile picture</h1>
      <div>
        <img
          src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/457513733_122229466964002441_2844223550811568095_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=XzChrlPOGI8Q7kNvgGsRtpt&_nc_ht=scontent.fdad1-2.fna&oh=00_AYD1-_765OQ0K6oQ1_iM01kBg9JFLLJ0emImHh-wRS2XGQ&oe=66E4538B"
          alt="avatar-user"
          class="size-16 rounded-full"
        />
      </div>
      <span class="text-primary cursor-pointer text-[14px] hover:font-medium"
        >Update profile picture</span
      >
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
              :disabled="!email"
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
                :checked="selectedGender === 'Male'"
                @update:modelValue="updateSelection('Male')"
              />
              <CheckboxCustom
                label="Female"
                groupName="gender"
                :checked="selectedGender === 'Female'"
                @update:modelValue="updateSelection('Female')"
              />
            </div>
          </div>
          <!-- DATE OF BIRTH -->
          <div class="flex flex-col gap-y-2 w-full md:w-1/2">
            <label for="gender" class="text_para">Date of birth</label>
            <div class="flex">
              <input
                v-model="selectedDate"
                class="w-full select_custom text-[14px]"
                type="date"
                name=""
              />
            </div>
          </div>
          <!-- COUNTRY VS STATE -->
          <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
            <div class="flex flex-col gap-y-2 w-full md:w-1/2">
              <label for="gender" class="text_para">City</label>
              <select v-model="selectedCountry" class="select_custom" @change="handleCountryChange">
                <option v-for="country in countries" :key="country.code" :value="country">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-y-2 w-full md:w-1/2">
              <label for="district" class="text_para">District</label>
              <select v-model="selectedState" class="select_custom">
                <option v-for="state in states" :key="state.code" :value="state">
                  {{ state.name }}
                </option>
              </select>
            </div>
          </div>
          <!-- CITY -->
          <div class="flex flex-col w-full md:w-1/2 gap-y-2">
            <label for="gender" class="text_para">City</label>
            <input type="text" class="input_custom" />
          </div>
        </div>
      </div>
      <Button type="submit" label="Save settings" class="btn w-full md:w-1/2 mt-8" />
    </div>
    <ChangePasswordPopup />
    <ChangePasswordSuccessPopup />
  </form>
</template>
