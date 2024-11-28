<script setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { usePopupStore } from '@/stores/popup.store';
  import { changePassword } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { Form, Field } from 'vee-validate';
  import { changePasswordSchema } from '@/utils/vadilation';

  const popupStore = usePopupStore();
  // SHOW PASSWORD
  const showPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmNewPassword = ref(false);

  // HANDLE SHOW INVALID PASSWORD
  const showInvalid = ref(false);

  // HANDLE SUBMIT CHANGEPASSWORD
  const handleChangePassword = async (values) => {
    try {
      const response = await changePassword(values);

      if (response.status === 400) {
        showInvalid.value = true;
      } else {
        popupStore.closeChangePassword();
        popupStore.openChangePasswordSuccess();
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  // handle submit invalid oldpassword
  const handleInput = () => {
    if (showInvalid.value || errors.value.length > 0) {
      showInvalid.value = false;
      errors.value = [];
    }
  };
</script>

<template>
  <Dialog
    modal
    :draggable="false"
    v-model:visible="popupStore.showChangePassword"
    header="Change Password"
    class="w-full md:w-[474px]"
  >
    <div class="py-2">
      <p class="mb-4 text-[12px] md:text-[14px]">
        Please enter your old and new password. Make sure your password is alphanumeric with at
        least 8 characters.
      </p>
      <Form @submit="handleChangePassword" :validation-schema="changePasswordSchema" class="pt-4">
        <div class="flex flex-col gap-y-5">
          <!-- Old Password -->
          <div class="flex flex-col gap-y-2 relative">
            <Field name="oldPass" v-slot="{ field, errors }">
              <label for="oldPassword" class="text_para pl-1">Old password</label>
              <div
                class="relative text-[14px] rounded-lg"
                :class="errors.length || showInvalid ? 'error_password' : 'normal_password'"
              >
                <input
                  placeholder="Enter old password"
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  class="password_custom"
                  @input="handleInput"
                />
                <button
                  @click="showPassword = !showPassword"
                  type="button"
                  class="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 z-20 px-3 cursor-pointer text-[#666666]"
                >
                  <i :class="[showPassword ? 'pi pi-eye' : 'pi pi-eye-slash']"></i>
                </button>
              </div>
              <span v-if="errors.length > 0" class="error_message">{{ errors[0] }}</span>
              <span v-else-if="showInvalid && errors.length === 0" class="error_message"
                >You have entered an invalid password</span
              >
            </Field>
          </div>

          <!-- New Password -->
          <div class="flex flex-col gap-y-2 relative">
            <Field name="newPass" v-slot="{ field, errors }">
              <label for="newPassword" class="text_para pl-1">New password</label>
              <div
                class="relative text-[14px] rounded-lg"
                :class="errors.length ? 'error_password' : 'normal_password'"
              >
                <input
                  placeholder="Enter new password"
                  v-bind="field"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="password_custom"
                />
                <button
                  @click="showNewPassword = !showNewPassword"
                  type="button"
                  class="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 z-20 px-3 cursor-pointer text-[#666666]"
                >
                  <i :class="showNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
              <span v-if="errors.length" class="error_message">{{ errors[0] }}</span>
            </Field>
          </div>

          <!-- Confirm New Password -->
          <div class="flex flex-col gap-y-2 relative">
            <Field name="confirmPass" v-slot="{ field, errors }">
              <label for="confirmNewPassword" class="text_para pl-1">Confirm new password</label>
              <div
                class="relative text-[14px] rounded-lg"
                :class="errors.length ? 'error_password' : 'normal_password'"
              >
                <input
                  placeholder="Confirm new password"
                  v-bind="field"
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  class="password_custom"
                />
                <button
                  @click="showConfirmNewPassword = !showConfirmNewPassword"
                  type="button"
                  class="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 z-20 px-3 cursor-pointer text-[#666666]"
                >
                  <i :class="showConfirmNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
              <span v-if="errors.length" class="error_message">{{ errors[0] }}</span>
            </Field>
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <Button type="submit" class="btn w-full md:w-2/3">Confirm</Button>
        </div>
      </Form>
    </div>
  </Dialog>
</template>
