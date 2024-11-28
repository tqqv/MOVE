<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import gmail from '@/components/icons/gmail.vue';
  import { usePopupStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import { postLogin } from '@/services/auth';
  import { useUserStore } from '@/stores';
  import { Form, Field } from 'vee-validate';
  import { loginSchema } from '@/utils/vadilation';
  import Warning from '../icons/warning.vue';

  const userStore = useUserStore();
  // const showLoginWithEmail = ref(false);
  const showPassword = ref(false);
  const popupStore = usePopupStore();

  // const handleLoginWithEmail = () => {
  //   showLoginWithEmail.value = true;
  // };

  // HANDLE LOGIN
  const submitLoginForm = async (values) => {
    const { email, password } = values;
    const data = { email, password };
    try {
      const response = await postLogin(data);
      if (response.error) {
        toast.error(response.message || 'Login failed');
      } else {
        userStore.fetchUserProfile();
        userStore.loadFollowers();
        userStore.loadFollowCategories();
        popupStore.closeLoginPopup();
        toast.success(response.message || 'Login successful!');
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Login failed');
    }
  };

  const openForgotPassword = () => {
    popupStore.closeLoginPopup();
    popupStore.openForgotPasswordPopup();
  };

  const handleGoogleLogin = () => {
    const url = `${import.meta.env.VITE_API_URL}auth/google`;
    window.open(url, '_self');
  };
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <!-- Login Google  -->

    <button
      @click="handleGoogleLogin"
      class="w-full bg-white text-black text-[16px] font-bold border border-[#CCCCCC] flex items-center px-4 py-2 rounded"
    >
      <span class="flex-shrink-0">
        <gmail class="mr-3" />
      </span>
      <span class="flex-grow text-center">Login with Google</span>
    </button>
    <div class="flex items-center w-full">
      <hr class="flex-grow border-t border-[#CCCCCC]" />
      <span class="mx-2 text-gray-500">or</span>
      <hr class="flex-grow border-t border-[#CCCCCC]" />
    </div>
    <!-- Login Email  -->
    <Form @submit="submitLoginForm" :validation-schema="loginSchema" class="w-full mt-4 space-y-4">
      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-2">
          <Field name="email" v-slot="{ field, errors }">
            <label for="email" class="text_para ml-1">Email</label>
            <div
              class="relative text-[14px] rounded-lg"
              :class="errors.length ? 'error_password' : 'normal_password'"
            >
              <input
                v-bind="field"
                type="text"
                class="password_custom"
                placeholder="Enter email"
                required
              />
              <Warning
                v-if="errors.length"
                class="absolute top-1/2 right-4 transform -translate-y-1/2"
              />
            </div>
            <span v-if="errors.length" class="error_message">{{ errors[0] }}</span>
          </Field>
        </div>

        <div class="flex flex-col gap-y-2">
          <Field name="password" v-slot="{ field, errors }">
            <label for="password" class="text_para ml-1">Password</label>
            <div
              class="relative text-[14px] rounded-lg"
              :class="errors.length ? 'error_password' : 'normal_password'"
            >
              <input
                v-bind="field"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password"
                class="password_custom"
                required
              />
              <button
                @click="showPassword = !showPassword"
                type="button"
                class="btn_eyes"
                tabindex="-1"
              >
                <i :class="[showPassword ? 'pi pi-eye' : 'pi pi-eye-slash']"></i>
              </button>
            </div>
            <span v-if="errors.length" class="error_message">{{ errors[0] }}</span>
          </Field>
        </div>
        <div class="flex justify-end">
          <span @click="openForgotPassword" class="text-link text-sm cursor-pointer"
            >Forgot password?</span
          >
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button type="submit" class="btn w-full">Log in</button>
      </div>
    </Form>

    <!-- <button @click="handleLoginWithEmail" v-else class="text-link font-bold uppercase text-sm">
      Log in with Email
    </button> -->
  </div>
</template>
