<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import gmail from '@/components/icons/gmail.vue';
  import facebook from '@/components/icons/facebook.vue';
  import { usePopupStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import { postLogin } from '@/services/auth';
  import { useUserStore } from '@/stores';

  const userStore = useUserStore();

  const showLoginWithEmail = ref(false);
  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const popupStore = usePopupStore();

  const buttonColor = computed(() => {
    return email.value.trim() && password.value.trim() ? 'btn' : 'btnDisable';
  });
  const isButtonDisabled = computed(() => {
    return !(email.value.trim() && password.value.trim());
  });
  const handleLoginWithEmail = () => {
    showLoginWithEmail.value = true;
  };

  const submitLoginForm = async () => {
    const data = {
      email: email.value,
      password: password.value,
    };

    try {
      const response = await postLogin(data);
      localStorage.setItem('isLogin', 'true');
      userStore.fetchUserProfile();
      toast.success(response.data.message);
      popupStore.closeLoginPopup();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
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
  // const isLogin = localStorage.getItem('isLogin');

  // onMounted(() => {
  //   console.log(isLogin);

  //   if (isLogin === 'true') {
  //     userStore.fetchUserProfile();
  //   }
  // });
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
    <form v-if="showLoginWithEmail" @submit.prevent="submitLoginForm" class="w-full mt-4 space-y-4">
      <div>
        <div>
          <label for="email" class="text_para">Email</label>
          <input v-model="email" type="email" class="input_custom" required />
        </div>
        <div class="relative">
          <label for="password" class="text_para">Password</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="p-2 text-[14px] rounded-lg border border-gray-dark focus:outline-primary focus:caret-primary w-full"
            required
          />
          <div
            @click="showPassword = !showPassword"
            type="button"
            class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
          >
            <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </div>
        </div>
        <div>
          <span @click="openForgotPassword" class="text-link text-sm cursor-pointer"
            >Forgot password?</span
          >
        </div>
      </div>
      <button
        type="submit"
        :class="['w-full p-2 text-white font-bold rounded', buttonColor]"
        :disabled="isButtonDisabled"
      >
        Log in
      </button>
    </form>

    <button @click="handleLoginWithEmail" v-else class="text-link font-bold uppercase text-sm">
      Log in with Email
    </button>
  </div>
</template>
