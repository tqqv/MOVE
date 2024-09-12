<script setup>
  import { ref, computed } from 'vue';
  import gmail from '@/components/icons/gmail.vue';
  import facebook from '@/components/icons/facebook.vue';
  import axiosInstance from '@/services/axios';
  import { toast } from 'vue3-toastify';

  const email = ref('');
  const password = ref('');
  const referralCode = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  const buttonColor = computed(() => {
    return email.value.trim() && password.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !(email.value.trim() && password.value.trim());
  });

  const submitSignupForm = async () => {
    if (password.value !== confirmPassword.value) {
      toast.error('Passwords do not match!');

      return;
    }
    const data = {
      email: email.value,
      password: password.value,
      referralCode: referralCode.value,
    };
    try {
      const response = await axiosInstance.post('/auth/register', data);
      console.log('Signup success:', response.data);
      toast.success(response.data.message || 'Signup successful!');
    } catch (error) {
      toast.error(error.response?.data.message || 'Signup failed');
    }
  };
</script>
<template>
  <div class="items-center space-y-4">
    <button
      class="w-full bg-white text-black text-[16px] font-bold border border-[#CCCCCC] flex items-center px-4 py-2 rounded"
    >
      <span class="flex-shrink-0">
        <gmail class="mr-3" />
      </span>
      <span class="flex-grow text-center">Sign up with Google</span>
    </button>
    <button
      class="w-full bg-white text-black text-[16px] font-bold border border-[#CCCCCC] flex items-center px-4 py-2 rounded"
    >
      <span class="flex-shrink-0">
        <facebook class="mr-3" />
      </span>
      <span class="flex-grow text-center">Sign up with Facebook</span>
    </button>
    <div class="flex items-center w-full">
      <hr class="flex-grow border-t border-[#CCCCCC]" />
      <span class="mx-2 text-gray-500">or</span>
      <hr class="flex-grow border-t border-[#CCCCCC]" />
    </div>
    <form @submit.prevent="submitSignupForm" class="w-full space-y-4">
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
        <div class="relative">
          <label for="confirmPassword" class="text_para">Confirm Password</label>
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="p-2 text-[14px] rounded-lg border border-gray-dark focus:outline-primary focus:caret-primary w-full"
            required
          />
          <div
            @click="showConfirmPassword = !showConfirmPassword"
            type="button"
            class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
          >
            <i :class="showConfirmPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </div>
        </div>
        <div>
          <label for="code" class="text_para">Referral code (<em>Optional</em>)</label>
          <input v-model="referralCode" type="number" class="input_custom" />
        </div>
        <div>
          <span class="text-sm text-[#777777]"
            >By clicking Sign Up, you are indicating that you have read and acknowledge the
            <a href="#" class="text-primary">Terms of Service</a> and
            <a href="#" class="text-primary">Privacy Notice</a>.
          </span>
        </div>
      </div>
      <button
        type="submit"
        :class="['w-full p-2 text-white font-bold rounded', buttonColor]"
        :disabled="isButtonDisabled"
      >
        Sign up
      </button>
    </form>
  </div>
</template>
