<script setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { usePopupStore } from '@/stores/popup.store';
  import { changePassword } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { Form, Field } from 'vee-validate';
  import { changePasswordSchema } from '@/functions/vadilation';

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
        <div class="flex flex-col gap-y-3">
          <!-- Old Password -->
          <div class="flex flex-col gap-y-1 relative">
            <Field name="oldPass" v-slot="{ field, errors }">
              <label for="oldPassword" class="text_para">Old password</label>
              <div class="relative">
                <input
                  placeholder="Enter old password"
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  class="input_custom"
                  :class="{
                    'focus:outline-red text-red focus:caret-red border-red':
                      showInvalid || errors.length,
                  }"
                />
                <button
                  @click="showPassword = !showPassword"
                  type="button"
                  class="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 z-20 px-3 cursor-pointer text-[#666666]"
                >
                  <i :class="[showPassword ? 'pi pi-eye' : 'pi pi-eye-slash']"></i>
                </button>
              </div>
              <span v-if="errors.length" class="text-[11px] italic text-red">{{ errors[0] }}</span>
              <span v-if="showInvalid" class="text-[11px] italic text-red"
                >"You have entered an invalid password"</span
              >
            </Field>
          </div>

          <!-- New Password -->
          <div class="flex flex-col gap-y-1 relative">
            <Field name="newPass" v-slot="{ field, errors }">
              <label for="newPassword" class="text_para">New password</label>
              <div class="relative">
                <input
                  placeholder="Enter new password"
                  v-bind="field"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="input_custom"
                />
                <button
                  @click="showNewPassword = !showNewPassword"
                  type="button"
                  class="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 z-20 px-3 cursor-pointer text-[#666666]"
                >
                  <i :class="showNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
              <span v-if="errors.length" class="text-[11px] italic text-red">{{ errors[0] }}</span>
            </Field>
          </div>

          <!-- Confirm New Password -->
          <div class="flex flex-col gap-y-1 relative">
            <Field name="confirmPass" v-slot="{ field, errors }">
              <label for="confirmNewPassword" class="text_para">Confirm new password</label>
              <div class="relative">
                <input
                  placeholder="Confirm new password"
                  v-bind="field"
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  class="input_custom"
                />
                <button
                  @click="showConfirmNewPassword = !showConfirmNewPassword"
                  type="button"
                  class="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 z-20 px-3 cursor-pointer text-[#666666]"
                >
                  <i :class="showConfirmNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
              <span v-if="errors.length" class="text-[11px] italic text-red">{{ errors[0] }}</span>
            </Field>
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <Button type="submit" class="btn w-full md:w-2/3">Confirm</Button>
        </div>
      </Form>
    </div>
  </Dialog>
</template>
