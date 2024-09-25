<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import logo from '@assets/logo.svg';
  import { postResetPassword, getVerifyToken } from '@/services/auth';
  import { toast } from 'vue3-toastify';

  const password = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const userId = ref(null);
  const email = ref('');
  const token = ref(useRoute().params.token || '');
  const router = useRouter();

  const isButtonDisabled = computed(
    () => !password.value.trim() || password.value !== confirmPassword.value,
  );

  const buttonColor = computed(() => (!isButtonDisabled.value ? 'btn' : 'btnDisable'));

  const togglePasswordVisibility = (type) => {
    if (type === 'password') showPassword.value = !showPassword.value;
    else if (type === 'confirmPassword') showConfirmPassword.value = !showConfirmPassword.value;
  };

  const verifyToken = async () => {
    try {
      const { data } = await getVerifyToken(token.value);

      if (!data) {
        toast.error('Invalid or expired token.');
        return false;
      }
      userId.value = data.data.userId;
      email.value = data.data.email;
      return true;
    } catch (error) {
      toast.error('Token verification failed. Please try again later.');
      return false;
    }
  };

  const submitResetForm = async () => {
    const isTokenValid = await verifyToken();
    if (!isTokenValid || isButtonDisabled.value) return;

    try {
      await postResetPassword({
        userId: userId.value,
        email: email.value,
        newPassword: password.value,
        confirmPassword: confirmPassword.value,
      });
      toast.success('Password reset successful');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      toast.error('Failed to reset password. Please try again later.');
    }
  };

  onMounted(verifyToken);
</script>

<template>
  <div class="bg-black h-[64px] flex items-center justify-center">
    <a href="#"><img class="h-8 w-auto" :src="logo" alt="Madison" /></a>
  </div>
  <div class="fixed inset-0 z-10 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75">
    <div class="relative bg-white rounded-lg shadow-xl w-[424px]">
      <div class="flex items-start pt-8 px-4">
        <div>
          <h3 class="text-base font-semibold leading-6 text-gray-900">Create new password</h3>
          <p class="mt-2 text-sm text-gray-500">
            Please enter your new password. Ensure it is alphanumeric and at least 8 characters
            long.
          </p>
        </div>
      </div>

      <form @submit.prevent="submitResetForm" class="w-full mt-4 space-y-4 px-4 py-3">
        <div class="space-y-2">
          <div class="relative">
            <label for="password" class="text_para">New Password</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input_custom"
              required
            />
            <div
              @click="togglePasswordVisibility('password')"
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
              class="input_custom"
              required
            />
            <div
              @click="togglePasswordVisibility('confirmPassword')"
              class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <button type="submit" :class="['w-1/2 p-2', buttonColor]" :disabled="isButtonDisabled">
            Confirm
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
