<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import gmail from '@/components/icons/gmail.vue';
  import facebook from '@/components/icons/facebook.vue';
  import { usePopupStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import { postLogin } from '@/services/auth';
  import { useUserStore } from '@/stores';
  import { Form, Field } from 'vee-validate';
  import { loginSchema } from '@/functions/vadilation';

  const userStore = useUserStore();
  const showLoginWithEmail = ref(false);
  const showPassword = ref(false);
  const popupStore = usePopupStore();

  
  // const buttonColor = computed(() => {
  //   return email.value.trim() && password.value.trim() ? 'btn' : 'btnDisable';
  // });
  // const isButtonDisabled = computed(() => {
  //   return !(email.value.trim() && password.value.trim());
  // });
  const handleLoginWithEmail = () => {
    showLoginWithEmail.value = true;
  };

// HANDLE LOGIN
  const submitLoginForm = async (values) => {
    const { email, password } = values;
    const data = { email, password };
    try {
      const response = await postLogin(data);
      if (response.error) {
        toast.error(response.message || 'Login failed');
      } else {
        localStorage.setItem('isLogin', 'true');
        userStore.fetchUserProfile();
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
    window.location.href = url;
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
    <!-- Login Facebook  -->

    <button
      class="w-full bg-white text-black text-[16px] font-bold border border-[#CCCCCC] flex items-center px-4 py-2 rounded"
    >
      <span class="flex-shrink-0">
        <facebook class="mr-3" />
      </span>
      <span class="flex-grow text-center">Login with Facebook</span>
    </button>
    <div class="flex items-center w-full">
      <hr class="flex-grow border-t border-[#CCCCCC]" />
      <span class="mx-2 text-gray-500">or</span>
      <hr class="flex-grow border-t border-[#CCCCCC]" />
    </div>
    <!-- Login Email  -->
    <Form
      v-if="showLoginWithEmail"
      @submit="submitLoginForm"
      :validation-schema="loginSchema"
      class="w-full mt-4 space-y-4"
    >
      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-1">
          <Field name="email" v-slot="{ field, errors }">
            <label for="email" class="text_para">Email</label>
            <input
              v-bind="field"
              type="email"
              class="input_custom"
              :class="{
                'focus:outline-red text-red focus:caret-red border-red': errors.length,
              }"
              required
            />
            <span v-if="errors.length" class="text-[11px] italic text-red">{{ errors[0] }}</span>
          </Field>
        </div>
        <div class="flex flex-col gap-y-1">
          <Field name="password" v-slot="{ field, errors }">
            <label for="password" class="text_para">Password</label>
            <div class="relative">
              <input
                v-bind="field"
                :type="showPassword ? 'text' : 'password'"
                class="input_custom"
                :class="{
                  'focus:outline-red text-red focus:caret-red border-red': errors.length,
                }"
                required
              />
              <button @click="showPassword = !showPassword" type="button" class="btn_eyes">
                <i :class="[showPassword ? 'pi pi-eye' : 'pi pi-eye-slash']"></i>
              </button>
            </div>
            <span v-if="errors.length" class="text-[11px] italic text-red">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <span @click="openForgotPassword" class="text-link text-sm cursor-pointer"
            >Forgot password?</span
          >
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button type="submit" class="btn w-full">Log in</button>
      </div>
    </Form>

    <button @click="handleLoginWithEmail" v-else class="text-link font-bold uppercase text-sm">
      Log in with Email
    </button>
  </div>
</template>
