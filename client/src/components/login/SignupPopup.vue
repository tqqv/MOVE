<script setup>
  import { ref, computed } from 'vue';
  import gmail from '@/components/icons/gmail.vue';
  import facebook from '@/components/icons/facebookLogin.vue';
  import { toast } from 'vue3-toastify';
  import { postSignup } from '@/services/auth';
  import { usePopupStore } from '@/stores';
  import { Form, Field } from 'vee-validate';
  import { signUpSchema } from '@/utils/vadilation';
  import Warning from '../icons/warning.vue';

  const popupStore = usePopupStore();
  const referralCode = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  const submitSignupForm = async (values) => {
    const { email, password, confirmPassword } = values;

    const data = { email, password, confirmPassword, referralCode: referralCode.value };
    try {
      const response = await postSignup(data);
      if (response.error) {
        toast.error(response.message || 'Signup failed');
      } else {
        popupStore.closeLoginPopup();
        toast.success(response.message || 'Signup successful!');
      }
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
    <Form @submit="submitSignupForm" :validation-schema="signUpSchema" class="w-full space-y-4">
      <div class="flex flex-col gap-y-4">
        <!-- EMAIL -->
        <div class="flex flex-col gap-y-2">
          <Field name="email" v-slot="{ field, errors }">
            <label for="email" class="text_para ml-1">Email</label>
            <div
              class="relative text-[14px] rounded-lg"
              :class="errors.length ? 'error_password' : 'normal_password'"
            >
              <input
                v-bind="field"
                type="email"
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
        <!-- PASSWORD -->
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
                class="password_custom"
                placeholder="Enter password"
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
        <!-- CONFIRM PASSWORD -->
        <div class="flex flex-col gap-y-2">
          <Field name="confirmPassword" v-slot="{ field, errors }">
            <label for="confirmPassword" class="text_para ml-1">Confirm Password</label>
            <div
              class="relative text-[14px] rounded-lg"
              :class="errors.length ? 'error_password' : 'normal_password'"
            >
              <input
                v-bind="field"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="password_custom"
                placeholder="Enter confirm password"
                required
              />
              <button
                @click="showConfirmPassword = !showConfirmPassword"
                type="button"
                class="btn_eyes"
                tabindex="-1"
              >
                <i :class="[showConfirmPassword ? 'pi pi-eye' : 'pi pi-eye-slash']"></i>
              </button>
            </div>
            <span v-if="errors.length" class="error_message">{{ errors[0] }}</span>
          </Field>
        </div>
        <div class="flex flex-col gap-y-1">
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
      <div class="flex justify-center mt-4">
        <Button type="submit" class="btn w-full">Sign up</Button>
      </div>
    </Form>
  </div>
</template>
