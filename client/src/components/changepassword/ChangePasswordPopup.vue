<script setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  import { usePopupStore } from '@/stores/popup.store';

  const popupStore = usePopupStore();

  const handleClose = () => {
    popupStore.closeChangePassword;
  };

  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmNewPassword = ref('');
  // const props = defineProps({
  //   showDialog: Boolean,
  // });

  // const emit = defineEmits(['update:showDialog']);

  // const handleClose = () => {
  //   emit('update:showDialog', false);
  // };

  // SHOW PASSWORD
  const showPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmNewPassword = ref(false);

  // WRONG PASSWORD
  const wrongPassword = ref(false);

  // HANDLE SUBMIT CHANGEPASSWORD
  const handleChangePassword = () => {};
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
      <form class="pt-4">
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-col gap-y-1 relative">
            <label for="oldPassword" class="text_para">Old password</label>
            <div class="relative">
              <input
                placeholder="Enter old password"
                v-model="oldPassword"
                :type="showPassword ? 'text' : 'password'"
                class="input_custom"
                :class="{ 'focus:outline-red text-red focus:caret-red border-red': wrongPassword }"
                required
              /><button
                @click="showPassword = !showPassword"
                type="button"
                class="absolute top-[26%] end-0 z-20 px-3 cursor-pointer text-[#666666]"
              >
                <i :class="[showPassword ? 'pi pi-eye' : 'pi pi-eye-slash']"></i>
              </button>
            </div>
            <span v-if="wrongPassword" class="text-[11px] italic text-red">
              You have entered an invalid password
            </span>
          </div>
          <!-- CONFIRM PASSWORD -->
          <div class="flex flex-col gap-y-1 relative">
            <label for="newPassword" class="text_para">New password</label>
            <div class="relative">
              <input
                placeholder="Enter new password"
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="input_custom"
                required
              />
              <button
                @click="showNewPassword = !showNewPassword"
                type="button"
                class="absolute top-[25%] end-0 z-20 px-3 cursor-pointer text-[#666666]"
              >
                <i :class="showNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-y-1 relative">
            <label for="confirmNewPassword" class="text_para">Confirm new password</label>
            <div class="relative">
              <input
                placeholder="Confirm new password"
                v-model="confirmNewPassword"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                class="input_custom"
                required
              />
              <button
                @click="showConfirmNewPassword = !showConfirmNewPassword"
                type="button"
                class="absolute top-[26%] end-0 z-20 px-3 cursor-pointer text-[#666666]"
              >
                <i :class="showConfirmNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <Button @click="handleChangePassword" type="submit" class="btn w-full md:w-2/3"
            >Confirm</Button
          >
        </div>
      </form>
    </div>
  </Dialog>
  
</template>
