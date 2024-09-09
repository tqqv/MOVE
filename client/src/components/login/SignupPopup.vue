<script setup>
  import { ref, computed } from 'vue';
  import gmail from '@/components/icons/gmail.vue';
  import facebook from '@/components/icons/facebook.vue';

  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  const buttonColor = computed(() => {
    return email.value.trim() && password.value.trim() ? 'btn' : 'btnDisable';
  });

  const isButtonDisabled = computed(() => {
    return !(email.value.trim() && password.value.trim());
  });

  const submitSignupForm = () => {};
</script>
<template>
  <div class="flex flex-col items-center space-y-4">
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
    <div class="flex items-center w-full my-2">
      <hr class="flex-grow border-t border-[#CCCCCC]" />
      <span class="mx-2 text-gray-500">or</span>
      <hr class="flex-grow border-t border-[#CCCCCC]" />
    </div>
    <form @submit.prevent="submitSignupForm" class="w-full mt-4 space-y-8">
      <div class="space-y-2">
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
          <button
            @click="showPassword = !showPassword"
            type="button"
            class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
          >
            <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
        <div class="relative">
          <label for="confirmPassword" class="text_para">Confirm Password</label>
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="p-2 text-[14px] rounded-lg border border-gray-dark focus:outline-primary focus:caret-primary w-full"
            required
          />
          <button
            @click="showConfirmPassword = !showConfirmPassword"
            type="button"
            class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
          >
            <i :class="showConfirmPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
        <div>
          <label for="code" class="text_para">Referral code (<em>Optional</em>)</label>
          <input v-model="email" type="number" class="input_custom" />
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
