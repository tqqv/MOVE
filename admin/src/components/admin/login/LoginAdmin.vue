<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { usePopupStore } from '@/stores';
  import { toast } from 'vue3-toastify';
  import { postLogin } from '@/services/auth';
  import { useUserStore } from '@/stores';
  import { Form, Field } from 'vee-validate';
  import { loginSchema } from '@/utils/vadilation';
  import Warning from '@components/icons/warning.vue';
  import logo from '@assets/logoBlack.svg';
  import { useRouter } from 'vue-router';
  const userStore = useUserStore();
  const showPassword = ref(false);
  const router = useRouter();

  // HANDLE LOGIN
  const submitLoginForm = async (values) => {
    const { email, password } = values;
    const data = { email, password };
    try {
      const response = await postLogin(data);
      console.log(response);

      if (response.error) {
        toast.error(response.message || 'Login failed');
      } else {
        userStore.fetchUserProfile();
        localStorage.setItem('role', response.data.role);
        toast.success(response.message || 'Login successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Login failed');
    }
  };
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-dark">
    <div class="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg w-[500px] space-y-6">
      <!-- Login Google  -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <RouterLink to="/"> <img :src="logo" alt="Logo" class="h-8 mx-auto" /> </RouterLink>
      </div>

      <!-- Login Email  -->
      <Form
        @submit="submitLoginForm"
        :validation-schema="loginSchema"
        class="w-full mt-4 space-y-4"
      >
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
    </div>
  </div>
</template>
